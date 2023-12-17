// userRoute.js

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

/**
 * Register a new user.
 * Endpoint: POST /users/register
 */
router.route('/register').post(userController.userRegister);

/**
 * Log in an existing user.
 * Endpoint: POST /users/login
 */
router.route('/login').post(userController.userLogin);

/**
 * Get a list of all users (requires authentication).
 * Endpoint: GET /users
 */
router.route('/').get(jwtMiddleware.verifyToken, userController.userListAll);

/**
 * Delete or update a user by user_id (requires user authentication).
 * Endpoint: DELETE /users/:user_id
 * Endpoint: PUT /users/:user_id
 */
router
  .route('/:user_id')
  .delete(jwtMiddleware.verifyUserToken, userController.userDelete)
  .put(jwtMiddleware.verifyUserToken, userController.userPut);

module.exports = router;
