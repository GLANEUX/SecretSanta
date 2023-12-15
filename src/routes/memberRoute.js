const express = require('express');
const router = express.Router();

const memberController = require('../controllers/memberController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// router
//     .route('/:group_id/secretsanta')
//     .post(memberController.);

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

// router
//     .route('/:group_id/secretsanta')
//     .post(memberController.memberSecretSanta)

module.exports = router;

// # MEMBERS
// - 🔐`/members/:group_id/secretsanta` return list of all and blend (`POST`)
// - 🔐`/members/:user_id/:group_id` return delete user (`DELETE`)

