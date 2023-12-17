// groupRoute.js

const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

/**
 * Perform actions on a group (delete, update, get member information).
 * Endpoint: DELETE /groups/:group_id/:user_id
 * Endpoint: PUT /groups/:group_id/:user_id
 * Endpoint: GET /groups/:group_id/:user_id
 */
router
  .route('/:group_id/:user_id')
  .delete(jwtMiddleware.verifyUserToken, groupController.groupDelete)
  .put(jwtMiddleware.verifyUserToken, groupController.groupUpdate)
  .get(jwtMiddleware.verifyUserToken, groupController.seeMySanta);

/**
 * Get a list of group members (with SecretSanta information).
 * Endpoint: GET /groups/:group_id/:user_id/members
 */
router
  .route('/:group_id/:user_id/members')
  .get(jwtMiddleware.verifyUserToken, groupController.seeMembersSanta);

/**
 * Get a list of user's groups or create a new group.
 * Endpoint: GET /groups/:user_id
 * Endpoint: POST /groups/:user_id
 */
router
  .route('/:user_id')
  .get(jwtMiddleware.verifyUserToken, groupController.grouplist)
  .post(jwtMiddleware.verifyUserToken, groupController.groupCreate);

module.exports = router;
