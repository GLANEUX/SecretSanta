//groupController.js
const Group = require('../models/groupModel');
const Member = require('../models/memberModel');
const User = require('../models/userModel');


/**
 * Creates a new group and assigns the user as the administrator.
 * Requires user authentication.
 * Endpoint: POST /groups/:user_id
 */
exports.groupCreate = async (req, res) => {
    try {
        // Create a new group with the provided data and assign the user as the administrator
        let newGroup = new Group({ ...req.body, user_id: req.params.user_id });
        let group = await newGroup.save();

        // Create a new member for the user in the group with admin privileges
        let newMember = new Member({ user_id: req.params.user_id, group_id: newGroup._id });
        newMember.accept = true;
        newMember.admin = true;
        let member = await newMember.save();

        res.status(201).json({ message: `Group created: ${group.name}, you are the administrator` });
    } catch (error) {
        // Log the error and respond with a bad request message
        console.log(error);
        res.status(400).json({ message: `Invalid request` });
    }
};

/**
 * Get a list of groups for a user, including their role (Administrator or Santa) and the number of members.
 * Requires user authentication.
 * Endpoint: GET /groups/:user_id
 */
exports.grouplist = async (req, res) => {
    try {
        // Find all accepted groups for the user
        const users = await Member.find({ user_id: req.params.user_id, accept: true });

        // Check if the user is a member of any groups
        if (users.length === 0) {
            res.status(404).json({ message: "You are not a member of any groups" });
            return;
        }

        // Extract group IDs from the user data
        const groupIds = users.map(user => user.group_id);

        // Find all groups based on the extracted group IDs
        const groups = await Group.find({ _id: { $in: groupIds } });

        // Create an array with information about each group, including role and member count
        const groupArray = await Promise.all(groups.map(async group => {
            const user = users.find(user => user.group_id.toString() === group._id.toString());
            const role = user && user.admin ? "Administrator" : "Santa";

            const memberCount = await Member.countDocuments({ group_id: group._id, accept: true });

            return {
                name: group.name,
                role: role,
                memberCount: memberCount,
            };
        }));

        res.status(200).json(groupArray);
    } catch (error) {
        // Log the error and respond with a server error message
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};

/**
 * Delete a group, including all members who have not accepted the invitation.
 * Requires user authentication and administrator role for the group.
 * Endpoint: DELETE /groups/:group_id/:user_id
 */
exports.groupDelete = async (req, res) => {
    try {
        // Check if the group exists
        const groups = await Group.find({ _id: req.params.group_id });

        if (groups.length === 0) {
            res.status(404).json({ message: "This group does not exist" });
            return;
        }

        // Check if the requester is an administrator of the group
        const isAdmin = groups.some(group => group.user_id.toString() === req.params.user_id);

        if (!isAdmin) {
            res.status(401).json({ message: "You are not the administrator of this group" });
            return;
        }

        // Find all members of the group who have not accepted the invitation
        const members = await Member.find({ group_id: req.params.group_id, accept: false });

        // Iterate through members and delete corresponding users with invited set to true
        for (const member of members) {
            await User.findOneAndDelete({_id: member.user_id, invited: true});
        }

        // Delete all members of the group
        await Member.deleteMany({ group_id: req.params.group_id });

        // Delete the group
        await Group.findByIdAndDelete(req.params.group_id);

        res.status(200).json({ message: 'Group deleted' });
    } catch (error) {
        // Log the error and respond with a server error message
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};

/**
 * Update the name of a group.
 * Requires user authentication and administrator role for the group.
 * Endpoint: PUT /groups/:group_id/:user_id
 */
exports.groupUpdate = async (req, res) => {
    try {
        // Check if the group exists
        const groups = await Group.find({ _id: req.params.group_id });

        if (groups.length === 0) {
            res.status(404).json({ message: "This group does not exist" });
            return;
        }

        // Check if the requester is an administrator of the group
        const isAdmin = groups.some(group => group.user_id.toString() === req.params.user_id);

        if (!isAdmin) {
            res.status(401).json({ message: "You are not the administrator of this group" });
            return;
        }

        // Check if the name field is provided in the request body
        if (req.body.name === undefined) {
            res.status(401).json({
                message: "Please fill in at least one of the fields"
            });
            return;
        }

        // Update the name of the group
        const updatedGroup = await Group.findByIdAndUpdate(
            req.params.group_id,
            { name: req.body.name },
            { new: true }
        );

        res.status(200).json({ message: `Group updated: ${updatedGroup.name}` });
    } catch (error) {
        // Log the error and respond with a server error message
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};

/**
 * Retrieve the assigned Secret Santa for the user in a specific group.
 * Requires user authentication and acceptance of the group invitation.
 * Endpoint: GET /groups/:group_id/:user_id
 */
exports.seeMySanta = async (req, res) => {
    try {
        // Find the member in the group for the specified user
        const user = await Member.findOne({ user_id: req.params.user_id, group_id: req.params.group_id, accept: true });

        // Check if the user is a member of the group and has accepted the invitation
        if (!user) {
            res.status(404).json({ message: "You do not belong to this group or have not yet accepted the invitation" });
            return;
        }

        // Initialize an object to store the assigned Secret Santa's email
        let secretName = { email: "" };

        // Check if the user has been assigned a Secret Santa
        if (!user.santa_id) {
            secretName.email = "No one at the moment; wait for the administrator to launch Secret Santa";
        } else {
            // Retrieve the email of the assigned Secret Santa
            const santa = await User.findOne({ _id: user.santa_id });
            secretName.email = santa.email;
        }

        res.status(200).json({ message: `You need to give a gift to ${secretName.email}` });

    } catch (error) {
        // Log the error and respond with a server error message
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};

/**
 * Retrieve information about all members in a group, including their assigned Secret Santas.
 * Requires administrator authentication for the group.
 * Endpoint: GET /groups/:group_id/:user_id/members
 */
exports.seeMembersSanta = async (req, res) => {
    try {
        // Find all members associated with the specified group and user
        const users = await Member.find({ user_id: req.params.user_id, group_id: req.params.group_id, accept: true });

        // Check if the group exists
        if (users.length === 0) {
            res.status(404).json({ message: "This group does not exist" });
            return;
        }

        // Check if the requester is an administrator of the group
        const isAdmin = await Group.findOne({ user_id: req.params.user_id, _id: req.params.group_id });

        if (!isAdmin) {
            res.status(401).json({ message: "You are not the administrator of this group" });
            return;
        }

        // Fetch all members in the specified group
        const groupMembers = await Member.find({ group_id: req.params.group_id });

        // Check if any members are found
        if (!groupMembers || groupMembers.length === 0) {
            res.status(404).json({ message: "No members found in this group" });
            return;
        }

        // Retrieve data for each group member, including assigned Secret Santa information
        const membersData = await Promise.all(groupMembers.map(async member => {
            const userData = await User.findOne({ _id: member.user_id });
            const santaData = member.santa_id ? await User.findOne({ _id: member.santa_id }) : null;

            return {
                memberEmail: userData.email,
                santaEmail: santaData ? santaData.email : "Not assigned yet",
                accept: member.accept,
            };
        }));

        // Respond with the member data
        res.status(200).json(membersData);
    } catch (error) {
        // Log the error and respond with a server error message
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};
