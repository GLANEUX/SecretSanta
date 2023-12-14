const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router
    .route('/register')
    .post(userController.userRegister);

router
    .route('/login')
    .post(userController.userLogin);

router
    .route('/')
    .get(jwtMiddleware.verifyToken, userController.userListAll);
    
router
    .route('/:user_id')
    .delete(jwtMiddleware.verifyToken, jwtMiddleware.verifyUserToken, userController.userDelete)
    .put(jwtMiddleware.verifyToken, jwtMiddleware.verifyUserToken, userController.userPut);

module.exports = router;




// # /USERS
// -   `/users/register` return email, [email correct & can't already exist, secure password] (`POST`)
// -   `/users/login` return a token, [good mdp & email] (`POST`) `TOKEN`
// - 🔐`/users/:user_id` return user delete (`DELETE`)
// - 🔐`/users/:user_id` return the new email (`PUT`)
// - 🔒`/users` return all the users (`GET`)