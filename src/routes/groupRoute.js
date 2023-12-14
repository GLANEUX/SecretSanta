const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// router
//     .route('/new')
//     .post(userController.);

// router
//     .route('/:group_id')
//     .delete(userController.);
//     .put(userController.);
//     .get(userController.);
//     .post(userController.);
    
// router
//     .route('/:user_id')
//     .get(jwtMiddleware.verifyToken, jwtMiddleware.verifyUserToken, userController.userDelete)

module.exports = router;

// - 🔒`/groups/new` return group name & you're admin (`POST`)
// - 🔐`/groups/:group_id` return delete group (`DELETE`)
// - 🔐`/groups/:group_id` return modified name (`PUT`)
// - 🔐`/groups/:group_id` return your santa [admin see all] (`GET`)
// - 🔐`/groups/:group_id` return list of all and blend (`POST`)
// - 🔐`/groups/:user_id` return all group were they are (`GET`)




