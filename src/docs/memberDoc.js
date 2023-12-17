// memberDoc.js

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: API endpoints for managing group members
 * 
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - user_id
 *         - group_id
 *         - accept
 *         - admin
 *       properties:
 *         user_id:
 *           type: string
 *           description: The ID of the user
 *         group_id:
 *           type: string
 *           description: The ID of the group
 *         santa_id:
 *           type: string
 *           description: The ID of the Secret Santa assigned to the member
 *         accept:
 *           type: boolean
 *           description: Indicates whether the user has accepted the group invitation
 *         admin:
 *           type: boolean
 *           description: Indicates whether the user is an administrator of the group
 *       example:
 *         user_id: abc123
 *         group_id: xyz456
 *         santa_id: def789
 *         accept: true
 *         admin: false
 */

/**
 * @swagger
 * /members/{group_id}:
 *   post:
 *     summary: Request to join a group
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       200:
 *         description: Successfully requested to join the group.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       401:
 *         description: Invalid request. User not authorized or group does not exist.
 *       500:
 *         description: Some server error

 *   delete:
 *     summary: Delete a member from a group
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member successfully deleted.
 *       401:
 *         description: Invalid request. User not authorized or group does not exist.
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /members/{user_id}/{group_id}/decline:
 *   post:
 *     summary: Decline a group invitation
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invitation declined successfully.
 *       401:
 *         description: Invalid request. User not authorized or invitation does not exist.
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /members/{user_id}/{group_id}/accept:
 *   post:
 *     summary: Accept a group invitation
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invitation accepted successfully.
 *       401:
 *         description: Invalid request. User not authorized or invitation does not exist.
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /members/{user_id}/{group_id}/secretsanta:
 *   post:
 *     summary: Initiate the Secret Santa assignment process for a group
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Secret Santa assignments initiated successfully.
 *       400:
 *         description: Invalid request. Insufficient members in the group.
 *       401:
 *         description: Invalid request. User not authorized or group does not exist.
 *       500:
 *         description: Some server error
 */
