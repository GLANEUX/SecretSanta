// userDoc.js

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 * 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         id: 657f52e7bc2b0050338da62a
 *         email: user@gmail.com
 *         password: Password123?
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User successfully registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid request. Password requirements not met or invalid email address.
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid email address or password does not meet the criteria."
 *       409:
 *         description: User already exists.
 *         content:
 *           application/json:
 *             example:
 *               message: "User with this email address already exists."
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: "An error occurred during processing. Please try again later."
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *           example:
 *             email: user@example.com
 *             password: Password123? 
 *     responses:
 *       200:
 *         description: User successfully logged in. Returns a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Incorrect email or password.
 *         content:
 *           application/json:
 *             example:
 *               message: "Incorrect email or password. Please check your credentials and try again."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "This user does not exist."
 *       422:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Password must be at least 5 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: "An error occurred during processing. Please try again later."
 */

/**
 * @swagger
 * /users/{user_id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       401:
 *         description: Unauthorized. Invalid or missing authentication token.
 *         content:
 *           application/json:
 *             example:
 *               message: Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden. Incorrect Token! User ID Mismatch or Invalid User Token.
 *         content:
 *           application/json:
 *             example:
 *               message: User ID in the token does not match the requested user ID or Invalid User Token.
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: An error occurred during processing.
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User successfully deleted.
 *         content:
 *           application/json:
 *             example:
 *               message: User and associated data successfully deleted.
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: An error occurred during processing.
 */

/**
 * @swagger
 * /users/{user_id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error.
 *         content:
 *           application/json:
 *             example:
 *               message: An error occurred during processing.
 *       401:
 *         description: Unprocessable Entity. At least one of the fields (password or email) must be provided.
 *         content:
 *           application/json:
 *             example:
 *               message: Fill in at least one of the fields.
 *       422:
 *         description: Unprocessable Entity. he provided email address is not valid and Password must be at least 5 characters and contain specific criteria.
 *         content:
 *           application/json:
 *             example:
 *               message: The email address is not valid & Password must be at least 5 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Some server error
 */

