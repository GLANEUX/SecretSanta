const express = require('express');
const router = express.Router();

const memberController = require('../controllers/memberController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router
    .route('/:group_id')
    .post(jwtMiddleware.verifyToken, memberController.memberRequest)


router
    .route('/:group_id/:user_id')
    .delete(jwtMiddleware.verifyToken, memberController.memberDelete) 


router
    .route('/:user_id/:group_id/decline')
    .post(jwtMiddleware.verifyMemberToken, memberController.memberDecline)

router
    .route('/:user_id/:group_id/accept')
    .post(jwtMiddleware.verifyMemberToken, memberController.memberAccept)

router
    .route('/:user_id/:group_id/secretsanta')
    .post(jwtMiddleware.verifyUserToken, memberController.memberSecretSanta) 

module.exports = router;



