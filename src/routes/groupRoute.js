const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');


router
    .route('/:group_id/:user_id')
        .delete(jwtMiddleware.verifyUserToken, groupController.groupDelete) //ça ne supprime pas les users avec intited: true
        .put(jwtMiddleware.verifyUserToken, groupController.groupUpdate)
        .get(jwtMiddleware.verifyUserToken, groupController.seeMySanta);


router
    .route('/:group_id/:user_id/members')
    .get(jwtMiddleware.verifyUserToken, groupController.seeMembersSanta);

router
    .route('/:user_id')
        .get(jwtMiddleware.verifyUserToken, groupController.grouplist)
        .post(jwtMiddleware.verifyUserToken, groupController.groupCreate);

module.exports = router;





