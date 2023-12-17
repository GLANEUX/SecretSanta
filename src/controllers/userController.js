//userController.js
const User = require('../models/userModel');
const Member = require('../models/memberModel');
const Group = require('../models/groupModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Email = require('mongoose-type-email');
require('dotenv').config();

const saltRounds = 10;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;


/**
 * Controller function to handle user registration.
 * Endpoint: POST /users/register
 */
exports.userRegister = async (req, res) => {
    try {
        // Create a new user with the provided data
        const newUser = new User({
            ...req.body,
            invited: false,
        });

        // Regular expression to validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if the provided email is valid
        if (!emailRegex.test(req.body.email)) {
            res.status(401).json({
                message: "Invalid email address."
            });
            return;
        }

        // Check if the provided password meets the required criteria
        if (!passwordRegex.test(newUser.password)) {
            res.status(401).json({
                message: "Password must be at least 5 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            });
            return;
        }

        // Hash the password before saving it to the database
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);

        // Save the new user to the database
        let user = await newUser.save();
        
        // Respond with a success message
        res.status(201).json({ message: `User created: ${user.email}` });
    } catch (error) {
        // Log the error and respond with a server error message
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};

/**
 * Handles user login functionality, verifies credentials, and generates a JWT token for authentication.
 * Endpoint: POST /users/login
 */
exports.userLogin = async (req, res) => {
    try {
        // Find the user with the provided email
        const user = await User.findOne({ email: req.body.email });

        // Check if the user exists
        if (!user) {
            res.status(500).json({ message: "This user does not exist" });
            return;
        }

        // If the user is invited, update the password and set invited to false
        if (user.invited === "true") {
            // Check if the provided password meets the required criteria
            if (!passwordRegex.test(req.body.password)) {
                res.status(401).json({
                    message: "Password must be at least 5 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
                });
                return;
            }

            // Hash the new password
            const hashpass = await bcrypt.hash(req.body.password, saltRounds);

            // Update user's password and set invited to false
            const paramsUser = {
                password: hashpass,
                invited: false
            };

            await User.findByIdAndUpdate(user._id, paramsUser, { new: true });
        }

        // Fetch the user data after potential password update
        const userHere = await User.findOne({ email: req.body.email });

        // Check if the provided password is valid
        const isPasswordValid = await bcrypt.compare(req.body.password, userHere.password);

        // If the email and password are correct, generate a JWT token
        if (userHere.email === req.body.email && isPasswordValid) {
            const userData = {
                id: userHere._id,
                email: userHere.email,
                invited: false
            };

            // Generate a JWT token with user data
            const token = await jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "10h" });

            // Respond with the generated token
            res.status(200).json({ token });
        } else {
            // Respond with an authentication error message
            res.status(401).json({ message: "Incorrect email or password" });
        }
    } catch (error) {
        // Log the error and respond with a server error message
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};


/**
 * Deletes a user and associated data.
 * Requires user authentication.
 * Endpoint: DELETE /users/:user_id
 */
exports.userDelete = async (req, res) => {
    try {
        // Find groups associated with the user
        const groups = await Group.find({ user_id: req.params.user_id });

        if (groups.length > 0) {
            // Iterate through each group
            for (const group of groups) {
                const group_id = group._id;

                // Find all members of the group who have not accepted the invitation
                const members = await Member.find({ group_id: group_id, accept: false });

                // Iterate through members and delete corresponding users with invited set to true
                for (const member of members) {
                    // Use findOneAndDelete to delete the user not connected                   
                    await User.findOneAndDelete({ _id: member.user_id, invited: true });
                }

                // Delete all members of the group
                await Member.deleteMany({ group_id: group_id });

                // Delete the group itself
                await Group.findByIdAndDelete(group_id);
            }
        }

        // Delete the user
        await User.findByIdAndDelete(req.params.user_id);

        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        // Log the error and respond with a server error message
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};

/**
 * Handles updating user information, including password and email.
 * At least one of the fields (password or email) must be provided.
 * Endpoint: PUT /users/:user_id
 */
exports.userPut = async (req, res) => {
    try {
        // Check if at least one of the fields (password or email) is provided
        if (req.body.password === undefined && req.body.email === undefined) {
            res.status(401).json({
                message: "Fill in at least one of the fields"
            });
            return;
        }

        // If the password is provided, validate and hash it
        if (req.body.password) {
            // Check if the provided password meets the required criteria
            if (!passwordRegex.test(req.body.password)) {
                res.status(401).json({
                    message: "Password must be at least 5 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
                });
                return;
            }

            // Hash the new password
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }

        // If the email is provided, validate it
        if (req.body.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Check if the provided email is valid
            if (!emailRegex.test(req.body.email)) {
                res.status(401).json({
                    message: "The email address is not valid."
                });
                return;
            }
        }

        // Update user information and get the updated user data
        const user = await User.findByIdAndUpdate(req.params.user_id, req.body, { new: true });

        // Respond with a success message
        res.status(201).json({ message: `User modified: ${user.email}` });

    } catch (error) {
        // Log the error and respond with a server error message
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};

/**
 * Gets a list of all users.
 * Requires authentication.
 * Endpoint: GET /users
 */
exports.userListAll = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({});

        try {
            // Map the users to include only necessary information (_id and email)
            const userArray = users.map(user => ({ _id: user._id, email: user.email }));

            // Respond with the list of users
            res.status(200).json(userArray);
        } catch (error) {
            // Log the error and respond with an invalid request message
            console.log(error);
            res.status(401).json({ message: "Invalid request" });
        }
    } catch (error) {
        // Log the error and respond with a server error message
        console.log(error);
        res.status(500).json({ message: "An error occurred during processing" });
    }
};
