const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// router
//     .route('/:group_id/secretsanta')
//     .post(memberController.);

// router
//     .route('/:user_id/:group_id')
//     .post(memberController.);

// router
//     .route('/:user_id/:group_id/decline')
//     .post(jwtMiddleware.verifyToken, jwtMiddleware.verifyUserToken, memberController.userDelete)

// router
//     .route('/:user_id/:group_id/accept')
//     .post(jwtMiddleware.verifyToken, jwtMiddleware.verifyUserToken, memberController.userDelete)

module.exports = router;

// # MEMBERS
// - 🔐`/members/:group_id/secretsanta` return list of all and blend (`POST`)
// - 🔐`/members/:user_id/:group_id` return a token (`POST`) TOKEN
// - 🔐`/members/:user_id/:group_id/accept` return accept ok (`POST`) TOKEN need
// - 🔐`/members/:user_id/:group_id/decline` return supprimer (`POST`) TOKEN need
