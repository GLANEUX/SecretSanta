const Member = require('../models/memberModel');
const Group = require('../models/groupModel');
const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY;
require('dotenv').config();
const User = require('../models/userModel');




exports.memberRequest = async (req, res) => {
    try {

        // Check if the user making the request is an administrator

        const tokenveri = req.headers['authorization'];

        const payload = await new Promise((resolve, reject) => {
            jwt.verify(tokenveri, process.env.JWT_KEY, (error, decoded) => {
                if (error) {
                    console.log(error);
                    res.status(401).json({ message: `Requête invalide ici` });
                } else {
                    resolve(decoded)
                }
            })
        })
        req.user = payload;


        const groups = await Group.find({ _id: req.params.group_id, user_id: req.user.id });

        if (groups.length === 0) {
            res.status(401).json({ message: `Vous n'êtes pas l'administrateur de ce groupe ${req.params.group_id}` });
            return;
        }


        // récupère l'id de l'email 

        const users = await User.find({ email: req.body.email });


        if (users.length === 0) {
            //create the uster

            const newUser = new User({
                ...req.body,
                invited: true,
            });


            await newUser.save();

        }

        // Check if the user is already in the group
        const user = await Member.find({ user_id: users._id, group_id: req.params.group_id });

        if (user.length !== 0) {
            res.status(401).json({ message: `L'utilisateur est déjà dans ce groupe` });
            return;
        }

        // Create a new member with default values
        const newMember = new Member({
            user_id: req.params.user_id,
            group_id: req.params.group_id,
            accept: false,
            admin: false
        });



        // Save the new member to the database
        const member = await newMember.save();

        // Generate a token for the new member
        const memberData = {
            id: member._id,
            group_id: member.group_id,
            user_id: member.user_id,
        };

        const token = await jwt.sign(memberData, process.env.JWT_KEY, { expiresIn: "10h" });



        if (users.length === 0) {
            res.status(200).json({ message: `Vous avez créer un utilisateur ${req.body.email} et l'avez ajouter au group :  ${token}` });
        }

        if (users.length !== 0) {
            res.status(200).json({ message: `Vous avez ajouter au group :  ${token}` });

        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Une erreur s'est produite lors du traitement` });
    }
};






exports.memberDecline = async (req, res) => {
    try {


        const user = await User.find({ _id: req.params.user_id, invited: true })

        if (user) {
            await User.findOneAndDelete({ _id: req.params.user_id, invited: true });
        }


        await Member.findOneAndDelete({ user_id: req.params.user_id, group_id: req.params.group_id });
        res.status(200).json({ message: `Vous avez décliné l'invitation` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
};


exports.memberAccept = async (req, res) => {
    try {

        const usercreat = await User.find({ _id: req.params.user_id, invited: true })

        if (usercreat) {
            res.status(401).json({ message: "Vous devez vous connecctez avant" });
            return;
        }

        const filter = { user_id: req.params.user_id, group_id: req.params.group_id };

        const user = await Member.find(filter);

        if (user.length === 0) {
            res.status(401).json({ message: "L'invitation a expiré" });
            return;
        }

        const update = { accept: true };
        const options = { new: true };

        const updatedMember = await Member.findOneAndUpdate(filter, update, options);

        res.status(200).json({ message: "Vous avez accepté l'invitation" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
};



exports.memberDelete = async (req, res) => {

    try {
        // Check if the user making the request is an administrator

        const tokenveri = req.headers['authorization'];

        const payload = await new Promise((resolve, reject) => {
            jwt.verify(tokenveri, process.env.JWT_KEY, (error, decoded) => {
                if (error) {
                    console.log(error);
                    res.status(401).json({ message: `Requête invalide ici` });
                } else {
                    resolve(decoded)
                }
            })
        })
        req.user = payload;


        const groups = await Group.find({ _id: req.params.group_id, user_id: req.user.id });

        if (groups.length === 0) {
            res.status(401).json({ message: `Vous n'êtes pas l'administrateur de ce groupe ${req.params.group_id}` });
            return;
        }






        const user = await User.find({ _id: req.params.user_id, invited: true })

        if (user) {
            await User.findOneAndDelete({ _id: req.params.user_id, invited: true });
        }

        await Member.findOneAndDelete({ user_id: req.params.user_id, group_id: req.params.group_id });

        await User.findByIdAndDelete(req.params.user_id);
        res.status(200).json({ message: 'Utilisateur supprimé' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
}
