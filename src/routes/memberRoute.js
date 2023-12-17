// memberRoute.js

const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

/**
 * Request to join a group.
 * Endpoint: POST /members/:group_id
 */
router.route('/:group_id').post(jwtMiddleware.verifyToken, memberController.memberRequest);

/**
 * Delete a member from a group.
 * Endpoint: DELETE /members/:group_id/:user_id
 */
router.route('/:group_id/:user_id').delete(jwtMiddleware.verifyToken, memberController.memberDelete);

/**
 * Decline a group invitation.
 * Endpoint: POST /members/:user_id/:group_id/decline
 */
router
  .route('/:user_id/:group_id/decline')
  .post(jwtMiddleware.verifyMemberToken, memberController.memberDecline);

/**
 * Accept a group invitation.
 * Endpoint: POST /members/:user_id/:group_id/accept
 */
router
  .route('/:user_id/:group_id/accept')
  .post(jwtMiddleware.verifyMemberToken, memberController.memberAccept);

/**
 * Initiate the Secret Santa assignment process for a group.
 * Endpoint: POST /members/:user_id/:group_id/secretsanta
 */
router
  .route('/:user_id/:group_id/secretsanta')
  .post(jwtMiddleware.verifyUserToken, memberController.memberSecretSanta);

module.exports = router;
