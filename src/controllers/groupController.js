const Group = require('../models/groupModel');
const Member = require('../models/memberModel');
const User = require('../models/userModel');


exports.groupCreate = async (req, res) => {
    try {
        let newGroup = new Group({ ...req.body, user_id: req.params.user_id });
        let group = await newGroup.save();

        let newMember = new Member({ user_id: req.params.user_id, group_id: newGroup._id });
        newMember.accept = true;
        newMember.admin = true;
        let member = await newMember.save();

        res.status(201).json({ message: `Group créé: ${group.name}, vous ête l'administrateur` });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: `Requête invalide` });
    }
}


exports.grouplist = async (req, res) => {
    try {
        const users = await Member.find({ user_id: req.params.user_id, accept: true });

        if (users.length === 0) {
            res.status(404).json({ message: "Vous n'avez pas de groupe" });
            return;
        }
        const groupIds = users.map(user => user.group_id);
        const groups = await Group.find({ _id: { $in: groupIds } });

        const groupArray = await Promise.all(groups.map(async group => {
            const user = users.find(user => user.group_id.toString() === group._id.toString());
            const role = user && user.admin ? "Administrateur" : "Santa";

            const memberCount = await Member.countDocuments({ group_id: group._id, accept: true });

            return {
                name: group.name,
                role: role,
                memberCount: memberCount,
            };
        }));

        res.status(200).json(groupArray);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
};


exports.groupDelete = async (req, res) => {
    try {
        // Check if the group exists
        const groups = await Group.find({ _id: req.params.group_id });

        if (groups.length === 0) {
            res.status(404).json({ message: "Ce groupe n'existe pas" });
            return;
        }

        // Check if the requester is an administrator of the group
        const isAdmin = groups.some(group => group.user_id.toString() === req.params.user_id);

        if (!isAdmin) {
            res.status(401).json({ message: "Vous n'êtes pas l'administrateur de ce groupe" });
            return;
        }




// Find all members of the group who have not accepted the invitation
const members = await Member.find({ group_id: req.params.group_id, accept: false });

// Iterate through members and delete corresponding users with invited set to true
for (const member of members) {
    const user = await User.findByIdAndDelete(member.user_id);

}


        // Delete all members of the group
        await Member.deleteMany({ group_id: req.params.group_id });

        // Delete the group
        await Group.findByIdAndDelete(req.params.group_id);


        

        res.status(200).json({ message: 'Groupe supprimé' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
};

exports.groupUpdate = async (req, res) => {
    try {
        
        const groups = await Group.find({ _id: req.params.group_id });

        if (groups.length === 0) {
            res.status(404).json({ message: "Ce groupe n'existe pas" });
            return;
        }

        const isAdmin = groups.some(group => group.user_id.toString() === req.params.user_id);

        if (!isAdmin) {
            res.status(401).json({ message: "Vous n'êtes pas l'administrateur de ce groupe" });
            return;
        }

        if (req.body.name === undefined) {
            res.status(401).json({
                message: "Remplissez au moins un des champs"
            });
            return;
        }

        const updatedGroup = await Group.findByIdAndUpdate(
            req.params.group_id,
            { name: req.body.name },
            { new: true }
        );

        res.status(200).json({ message: `Groupe modifié: ${updatedGroup.name}` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
};


exports.seeMySanta = async (req, res) => {
    try {
        const users = await Member.findOne({ user_id: req.params.user_id, group_id: req.params.group_id, accept: true });

        if (!users) {
            res.status(404).json({ message: "Vous n'appartenez pas à ce groupe ou n'avez pas encore accepté l'invitation" });
            return;
        }
        
        let secretname = { email: "" };
        if (users.santa_id === "" || users.santa_id === undefined) {
            secretname.email = " personne pour l'instant, attendait que l'administrateur lance le secretSanta";
        } else {
            const user = await User.findOne({ _id: users.santa_id });
            secretname.email = user.email;
        }
        
        res.status(200).json({ message: `Vous devez offrir un cadeau à ${secretname.email}` });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
};


exports.seeMembersSanta = async (req, res) => {
    try {
        
    const users = await Member.find({ user_id: req.params.user_id, group_id: req.params.group_id, accept: true });

    if (users.length === 0) {
        res.status(404).json({ message: "Ce groupe n'existe pas" });
        return;
    }
    
    const isAdmin = Group.findOne({user_id: req.params.user_id, _id: req.params.group_id,});
    
    if (!isAdmin) {
        res.status(401).json({ message: "Vous n'êtes pas l'administrateur de ce groupe" });
        return;
    }

    const groupMembers = await Member.find({ group_id: req.params.group_id });

    if (!groupMembers || groupMembers.length === 0) {
        res.status(404).json({ message: "Aucun membre trouvé dans ce groupe" });
        return;
    }

    const membersData = await Promise.all(groupMembers.map(async member => {
        const userData = await User.findOne({ _id: member.user_id });
        const santaData = member.santa_id ? await User.findOne({ _id: member.santa_id }) : null;

        return {
            memberEmail: userData.email,
            santaEmail: santaData ? santaData.email : "Pas encore attribué",
            accept: member.accept,
        };
    }));

    res.status(200).json(membersData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
};