const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');


router
    .route('/:group_id/:user_id')
        .delete(jwtMiddleware.verifyUserToken, groupController.groupDelete)
        .put(jwtMiddleware.verifyUserToken, groupController.groupUpdate)
//     .get(groupController.);
//     .post(groupController.);
    
router
    .route('/:user_id')
        .get(jwtMiddleware.verifyUserToken, groupController.grouplist)
        .post(jwtMiddleware.verifyUserToken, groupController.groupCreate);

module.exports = router;

// - 🔐`/groups/:group_id` return your santa [admin see all] (`GET`)
// - 🔐`/groups/:group_id` return list of all and blend (`POST`)




