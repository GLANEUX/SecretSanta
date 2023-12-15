const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const saltRounds = 10;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
const Email = require('mongoose-type-email');
const Member = require('../models/memberModel');
const Group = require('../models/groupModel');

exports.userRegister = async (req, res) => {
    try {
        const newUser = new User({
            ...req.body,
            invited: false,
        });
     
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(req.body.email)) {
            res.status(401).json({
                message: "L'adresse email n'est pas valide."
            });
            return;
        }
        
        if (!passwordRegex.test(newUser.password)) {
            res.status(401).json({
                message: "Le mot de passe doit faire au moin 5 caractère et contenir au moins une majuscule, une minuscule, un chiffre, et un caractère spécial."
            });
            return;
        }
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);
 

        let user = await newUser.save();
        res.status(201).json({ message: `Utilisateur créé: ${user.email}` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
}


exports.userLogin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(500).json({ message: "Cet utilisateur n'existe pas" });
            return;
        }

        if (user.invited === "true") {
            if (!passwordRegex.test(req.body.password)) {
                res.status(401).json({
                    message: "Le mot de passe doit faire au moin 5 caractère et contenir au moins une majuscule, une minuscule, un chiffre, et un caractère spécial."
                });
                return;
            }
            hashpass = await bcrypt.hash(req.body.password, saltRounds);


            const paramsUser = {
                password: hashpass,
                invited: false
            };

            await User.findByIdAndUpdate(user._id, paramsUser, { new: true });
           
        }

        const userhere = await User.findOne({ email: req.body.email });


        let isPasswordValid = await bcrypt.compare(req.body.password, userhere.password);


        if (userhere.email === req.body.email && isPasswordValid) {
            const userData = {
                id: userhere._id,
                email: userhere.email,
                invited: false
            };
            const token = await jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "10h" });
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }

};







exports.userDelete = async (req, res) => {

    try {


        const group = await Group.find({ user_id: req.params.user_id });

        
        if (group.length > 0) {
            const group_id = group[0]._id;
        
            await Member.deleteMany({ group_id: group_id });
            await Group.findByIdAndDelete(group_id);
        }

        await User.findByIdAndDelete(req.params.user_id);

        res.status(200).json({ message: 'Utilisateur supprimé' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
}

















exports.userPut = async (req, res) => {
    try {

        if (req.body.password === undefined && req.body.email === undefined) {
            res.status(401).json({
                message: "Remplissez au moins un des champs"
            });
            return;
        }
        if (req.body.password) {
            if (!passwordRegex.test(req.body.password)) {
                res.status(401).json({
                    message: "Le mot de passe doit faire au moin 5 caractère et contenir au moins une majuscule, une minuscule, un chiffre, et un caractère spécial."
                });
                return;
            }
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(req.body.email)) {
            res.status(401).json({
                message: "L'adresse email n'est pas valide."
            });
            return;
        }
        
        let user = await User.findByIdAndUpdate(req.params.user_id, req.body, { new: true });

        res.status(201).json({ message: `Utilisateur modifié: ${user.email}` });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
}



exports.userListAll = async (req, res) => {
    try {
        const users = await User.find({});

        try {

            const userArray = users.map(user => ({ _id: user._id, email: user.email }));

            res.status(200).json(userArray);
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Requête invalide" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }

}
