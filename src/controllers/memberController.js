//memberController.js
const Member = require('../models/memberModel');
const Group = require('../models/groupModel');
const User = require('../models/userModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const jwtKey = process.env.JWT_KEY;
const saltRounds = 10;

/**
 * Controller function to handle a member request to join a group.
 * Requires administrator authentication for the group.
 * Endpoint: POST /members/:group_id
 */
exports.memberRequest = async (req, res) => {
    try {
        // Verify the requestor's token and extract payload
        const tokenveri = req.headers['authorization'];
        const payload = await new Promise((resolve, reject) => {
            jwt.verify(tokenveri, process.env.JWT_KEY, (error, decoded) => {
                if (error) {
                    console.log(error);
                    res.status(401).json({ message: "Invalid request" });
                } else {
                    resolve(decoded)
                }
            });
        });
        req.user = payload;

        // Check if the specified group exists
        const existGroup = await Group.find({ _id: req.params.group_id });
        if (existGroup.length === 0) {
            res.status(401).json({ message: "This group does not exist" });
            return;
        }

        // Check if the requestor is the administrator of the group
        const groups = await Group.find({ _id: req.params.group_id, user_id: req.user.id });
        if (groups.length === 0) {
            res.status(401).json({ message: `You are not the administrator of this group ${req.params.group_id}` });
            return;
        }

        // Find user by email
        const users = await User.find({ email: req.body.email });

        // If the user does not exist, generate a random password and create a new user
        if (users.length === 0) {
            // Check if the email is valid
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(req.body.email)) {
                res.status(401).json({ message: "Invalid email address" });
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

            // Save the new user
            await newUser.save();
        }

        // Fetch the user using the provided email
        const newUserAll = await User.findOne({ email: req.body.email });

        // Handle the case where no user is found with the specified email
        if (!newUserAll) {
            res.status(404).json({ message: "User not found with the specified email" });
            return;
        }

        // Check if the user is already a member of the group
        const user = await Member.find({ user_id: newUserAll._id, group_id: req.params.group_id });
        if (user.length !== 0) {
            res.status(401).json({ message: `The user is already a member of this group` });
            return;
        }

        // Create a new member with default values
        const newMember = new Member({
            user_id: newUserAll._id,
            group_id: req.params.group_id,
            accept: false,
            admin: false,
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

        // Respond with a success message and the generated token
        res.status(200).json({ message: `You have added ${req.body.email} to the group: ${token}` });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};

/**
 * Controller function to handle member decline of group invitation.
 * Endpoint: POST /members/:user_id/:group_id/decline
 */
exports.memberDecline = async (req, res) => {
    try {
        // Find the user with the specified ID and invited status
        const user = await User.find({ _id: req.params.user_id, invited: true });

        // If the user is found, delete the user with invited status
        if (user) {
            await User.findOneAndDelete({ _id: req.params.user_id, invited: true });
        }

        // Delete the member record associated with the user and group
        await Member.findOneAndDelete({ user_id: req.params.user_id, group_id: req.params.group_id });

        // Respond with a success message
        res.status(200).json({ message: "You have declined the invitation" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};


/**
 * Controller function to handle member acceptance of group invitation.
 * Endpoint: POST /members/:user_id/:group_id/accept
 */
exports.memberAccept = async (req, res) => {
    try {
        // Check if the user has logged in
        const userCreate = await User.findOne({ _id: req.params.user_id, invited: true });
        if (userCreate) {
            res.status(401).json({ message: "You must log in before accepting the invitation" });
            return;
        }

        // Check if the invitation exists
        const filter = { user_id: req.params.user_id, group_id: req.params.group_id };
        const user = await Member.find(filter);
        if (user.length === 0) {
            res.status(401).json({ message: "The invitation has expired" });
            return;
        }

        // Update the member record to mark the invitation as accepted
        const update = { accept: true };
        const options = { new: true };
        const updatedMember = await Member.findOneAndUpdate(filter, update, options);

        // Respond with a success message
        res.status(200).json({ message: "You have accepted the invitation" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};

/**
 * Controller function to handle the deletion of a member from a group.
 * Requires administrator authentication for the group.
 * Endpoint: DELETE /members/:group_id/:user_id
 */
exports.memberDelete = async (req, res) => {
    try {
        // Verify the request token
        const tokenVerification = req.headers['authorization'];
        const payload = await new Promise((resolve, reject) => {
            jwt.verify(tokenVerification, process.env.JWT_KEY, (error, decoded) => {
                if (error) {
                    console.log(error);
                    res.status(401).json({ message: "Invalid request here" });
                } else {
                    resolve(decoded);
                }
            });
        });
        req.user = payload;

        // Check if the requester is an administrator of the group
        const groups = await Group.find({ _id: req.params.group_id, user_id: req.user.id });
        if (groups.length === 0) {
            res.status(401).json({ message: "You are not the administrator of this group" });
            return;
        }

        // Check if the user to be deleted exists
        const existingUser = await Member.findOne({ user_id: req.params.user_id });
        if (!existingUser) {
            res.status(401).json({ message: "User not found" });
            return;
        }

        // Check if the user is trying to delete themselves
        if (req.params.user_id === req.user.id) {
            res.status(401).json({ message: "You cannot delete yourself" });
            return;
        }

        // If the user was invited, delete them from the User collection
        const userInvited = await User.findOne({ _id: req.params.user_id, invited: true });
        if (userInvited) {
            await User.findOneAndDelete({ _id: req.params.user_id, invited: true });
        }

        // Delete the member record
        await Member.findOneAndDelete({ user_id: req.params.user_id, group_id: req.params.group_id });

        // Respond with a success message
        res.status(200).json({ message: 'User deleted' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};

// Secret Santa assignment function
const assignSecretSantas = async (groupId) => {
    try {
        // Remove members with accept false
        // Find all members of the group who have not accepted the invitation
        const members = await Member.find({ group_id: groupId, accept: false });

        // Iterate through members and delete corresponding users with invited set to true
        for (const member of members) {
            await User.findOneAndDelete({ _id: member.user_id, invited: true });
        }

        // Delete all members of the group who have not accepted the invitation
        await Member.deleteMany({ group_id: groupId, accept: false });

        // Find all members of the group who have accepted the invitation
        const groupMembers = await Member.find({ group_id: groupId, accept: true });

        // Ensure there are at least 3 members for a Secret Santa exchange
        if (groupMembers.length < 3) {
            throw new Error("Insufficient members for Secret Santa exchange");
        }

        // Reset Santa assignments for all group members
        await Member.updateMany({ group_id: groupId }, { santa_id: null });

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

        // Success message
        console.log("Secret Santas assigned successfully!");
    } catch (error) {
        // Log error message
        console.error(error.message);
    }
};

// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index within the remaining elements
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at positions i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Helper function to get a random Santa from the remaining members
const getRandomSanta = (members, currentMember) => {
    // Exclude the current member from the potential Santas
    const remainingMembers = members.filter(member => member.user_id !== currentMember.user_id);

    // Generate a random index within the remaining members
    const randomIndex = Math.floor(Math.random() * remainingMembers.length);

    // Return the randomly selected Santa
    return remainingMembers[randomIndex];
};

/**
 * Controller function to handle the initiation of Secret Santa for a group.
 * Requires administrator authentication for the group.
 * Endpoint: POST /members/:user_id/:group_id/secretsanta
 */
exports.memberSecretSanta = async (req, res) => {
    try {
        const groupId = req.params.group_id;

        // Assign Secret Santas before fetching data
        await assignSecretSantas(groupId);

        // Fetch updated group members data
        const groupMembers = await Member.find({ group_id: groupId, accept: true });

        // Check if there are at least 3 members in the group
        if (!groupMembers || groupMembers.length < 3) {
            res.status(400).json({ message: "There must be at least 3 members in the group" });
            return;
        }

        // Prepare data for each group member and their Secret Santa
        const membersData = await Promise.all(groupMembers.map(async member => {
            const userData = await User.findOne({ _id: member.user_id });
            const santaData = member.santa_id ? await User.findOne({ _id: member.santa_id }) : null;

            return {
                memberEmail: userData.email,
                santaEmail: santaData ? santaData.email : "Not assigned yet",
            };
        }));

        // Respond with success and the Secret Santa assignments
        res.status(200).json({ message: "Secret Santa has been initiated", membersData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};
