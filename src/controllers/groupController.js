const Group = require('../models/groupModel');
const Member = require('../models/memberModel');


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






//a tester
exports.groupDelete = async (req, res) => {
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
        await Member.deleteMany({ group_id: req.params.group_id });

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