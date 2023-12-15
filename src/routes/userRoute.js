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
    .delete(jwtMiddleware.verifyUserToken, userController.userDelete)
    .put(jwtMiddleware.verifyUserToken, userController.userPut);

module.exports = router;

