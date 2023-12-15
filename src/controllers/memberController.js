const Member = require('../models/memberModel');
const Group = require('../models/groupModel');
const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY;
require('dotenv').config();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;




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

        const existgroup = await Group.find({ _id: req.params.group_id});
        if (existgroup.length === 0) {
            res.status(401).json({ message: `Ce groupe n'existe pas` });
            return;
        }
        const groups = await Group.find({ _id: req.params.group_id, user_id: req.user.id });

        if (groups.length === 0) {
            res.status(401).json({ message: `Vous n'êtes pas l'administrateur de ce groupe ${req.params.group_id}` });
            return;
        }


        // récupère l'id de l'email 

        const users = await User.find({ email: req.body.email });


        if (users.length === 0) {
            // Check if email is valid
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(req.body.email)) {
                res.status(401).json({
                    message: "L'adresse email n'est pas valide."
                });
                return;
            }
        
            // Generate a random password
            const generateRandomPassword = (length) => {
                const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
                let password = "";
                
                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * charset.length);
                    password += charset[randomIndex];
                }
            
                return password;
            };
        
            const randomPassword = generateRandomPassword(10); // Specify the desired length
        
            // Hash the random password
            const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);
        
            // Create the newUser object
            const newUser = new User({
                ...req.body,
                password: hashedPassword,
                invited: true,
            });
        

            await newUser.save();

        }



        const newuserall = await User.findOne({ email: req.body.email });

        if (!newuserall) {
            // Handle the case where no user is found with the specified email
            res.status(404).json({
                message: "Utilisateur non trouvé avec l'email spécifié."
            });
            return;
        }

        // Check if the user is already in the group
        const user = await Member.find({ user_id: newuserall._id, group_id: req.params.group_id });

        if (user.length !== 0) {
            res.status(401).json({ message: `L'utilisateur est déjà dans ce groupe` });
            return;
        }

        
        
        // Create a new member with default values
        const newMember = new Member({
            user_id: newuserall._id,
            group_id: req.params.group_id,
            accept: false,
            admin: false
        });
        
        // Rest of your code...
        

        // Save the new member to the database
        const member = await newMember.save();

        // Generate a token for the new member
        const memberData = {
            id: member._id,
            group_id: member.group_id,
            user_id: member.user_id,
        };

        const token = await jwt.sign(memberData, process.env.JWT_KEY, { expiresIn: "10h" });




            res.status(200).json({ message: `Vous avez ajouter ${req.body.email} au group :  ${token}` });

        


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

        const usercreat = await User.findOne({ _id: req.params.user_id, invited: true })

        if (usercreat) {
            res.status(401).json({ message: "Vous devez vous connectez avant" });
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
            res.status(401).json({ message: `Vous n'êtes pas l'administrateur de ce groupe` });
            return;
        }


        const existeuser = await Member.findOne({user_id: req.params.user_id})

        if(!existeuser){
            res.status(401).json({ message: `Utilisateur introuvable` });
            return;
        }

        if(req.params.user_id === req.user.id){
            res.status(401).json({ message: `Vous ne pouvez pas vous supprimer vous même` });
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

const assignSecretSantas = async (groupId) => {
    try {
        // Remove members with accept false
        await Member.deleteMany({ group_id: groupId, accept: false });
        
// Find all members of the group who have not accepted the invitation
const members = await Member.find({ group_id: groupId, accept: false });

// Iterate through members and delete corresponding users with invited set to true
for (const member of members) {
    const user = await User.findByIdAndDelete(member.user_id);

}

        // Find all members of the group who have accepted the invitation
        const groupMembers = await Member.find({ group_id: groupId, accept: true });

        // Ensure there are at least 3 members for a Secret Santa exchange
        if (groupMembers.length < 3) {
            throw new Error("Insufficient members for Secret Santa exchange");
        }

        // Shuffle the members array to randomize the order
        const shuffledMembers = shuffleArray(groupMembers);

        // Create an array to track assigned Santas
        const assignedSantas = [];

        // Iterate through the shuffled array to assign Secret Santas
        for (let i = 0; i < shuffledMembers.length; i++) {
            const currentMember = shuffledMembers[i];
            let santaAssigned = false;

            // Keep trying to assign a Santa until a valid assignment is made
            while (!santaAssigned) {
                // Randomly select a Santa from the remaining members
                const potentialSanta = getRandomSanta(shuffledMembers, currentMember);

                // Check if the selected Santa is not the current member and not already assigned
                if (
                    potentialSanta.user_id !== currentMember.user_id &&
                    !assignedSantas.includes(potentialSanta.user_id)
                ) {
                    // Assign the Santa and add to the assignedSantas array
                    await Member.findByIdAndUpdate(currentMember._id, { santa_id: potentialSanta.user_id });
                    assignedSantas.push(potentialSanta.user_id);
                    santaAssigned = true;
                }
            }
        }

        console.log("Secret Santas assigned successfully!");
    } catch (error) {
        console.error(error.message);
    }
};


// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Helper function to get a random Santa from the remaining members
const getRandomSanta = (members, currentMember) => {
    const remainingMembers = members.filter(member => member.user_id !== currentMember.user_id);
    const randomIndex = Math.floor(Math.random() * remainingMembers.length);
    return remainingMembers[randomIndex];
};

exports.memberSecretSanta = async (req, res) => {
    try {
        const groupId = req.params.group_id;

        // Assign Secret Santas before fetching data
        await assignSecretSantas(groupId);

        // Fetch updated group members data
        const groupMembers = await Member.find({ group_id: groupId, accept: true });

        if (!groupMembers || groupMembers.length < 3) {
            res.status(400).json({ message: "Il doit y avoir au moins 3 membres dans le groupe" });
            return;
        }

        const membersData = await Promise.all(groupMembers.map(async member => {
            const userData = await User.findOne({ _id: member.user_id });
            const santaData = member.santa_id ? await User.findOne({ _id: member.santa_id }) : null;

            return {
                memberEmail: userData.email,
                santaEmail: santaData ? santaData.email : "Pas encore attribué",
            };
        }));

        res.status(200).json({ message: "Secret Santa lancée", membersData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
};
