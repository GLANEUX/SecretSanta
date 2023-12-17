// groupDoc.js

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: API endpoints for managing groups and group members
 * 
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *         - user_id
 *         - name
 *       properties:
 *         user_id:
 *           type: string
 *           description: The ID of the user creating the group
 *         name:
 *           type: string
 *           description: The name of the group
 *       example:
 *         user_id: abc123
 *         name: MyGroup
 */

/**
 * @swagger
 * /groups/{user_id}:
 *   get:
 *     summary: Get a list of user's groups
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user's groups with roles and member count
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the group
 *                   role:
 *                     type: string
 *                     description: The role of the user in the group (Administrator or Santa)
 *                   memberCount:
 *                     type: integer
 *                     description: The number of members in the group
 *       401:
 *         description: Invalid request. User not authorized.
 *       404:
 *         description: User is not a member of any groups.
 *       500:
 *         description: Some server error

 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       201:
 *         description: Group created successfully.
 *       400:
 *         description: Invalid request. Group creation failed.
 *       401:
 *         description: Invalid request. User not authorized.
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /groups/{group_id}/{user_id}:
 *   delete:
 *     summary: Delete a group
 *     tags: [Groups]
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Group deleted successfully.
 *       401:
 *         description: Invalid request. User not authorized or not an administrator.
 *       404:
 *         description: Group does not exist.
 *       500:
 *         description: Some server error

 *   put:
 *     summary: Update the name of a group
 *     tags: [Groups]
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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name for the group
 *     responses:
 *       200:
 *         description: Group updated successfully.
 *       401:
 *         description: Invalid request. User not authorized or not an administrator.
 *       404:
 *         description: Group does not exist.
 *       500:
 *         description: Some server error

 *   get:
 *     summary: Retrieve the assigned Secret Santa for the user in a specific group
 *     tags: [Groups]
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Secret Santa information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the Secret Santa information
 *       401:
 *         description: Invalid request. User not authorized or not a member of the group.
 *       404:
 *         description: Group or user does not exist, or user has not accepted the invitation.
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /groups/{group_id}/{user_id}/members:
 *   get:
 *     summary: Retrieve information about all members in a group, including their assigned Secret Santas
 *     tags: [Groups]
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Member information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   memberEmail:
 *                     type: string
 *                     description: The email of the group member
 *                   santaEmail:
 *                     type: string
 *                     description: The email of the assigned Secret Santa
 *                   accept:
 *                     type: boolean
 *                     description: Indicates whether the member has accepted the invitation
 *       401:
 *         description: Invalid request. User not authorized or not an administrator.
 *       404:
 *         description: Group or user does not exist, or user has not accepted the invitation.
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /groups/{group_id}/{user_id}/members:
 *   get:
 *     summary: Retrieve information about all members in a group, including their assigned Secret Santas
 *     tags: [Groups]
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Member information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   memberEmail:
 *                     type: string
 *                     description: The email of the group member
 *                   santaEmail:
 *                     type: string
 *                     description: The email of the assigned Secret Santa
 *                   accept:
 *                     type: boolean
 *                     description: Indicates whether the member has accepted the invitation
 *       401:
 *         description: Invalid request. User not authorized or not an administrator.
 *       404:
 *         description: Group or user does not exist, or user has not accepted the invitation.
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /groups/{group_id}/{user_id}/members:
 *   get:
 *     summary: Retrieve information about all members in a group, including their assigned Secret Santas
 *     tags: [Groups]
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Member information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   memberEmail:
 *                     type: string
 *                     description: The email of the group member
 *                   santaEmail:
 *                     type: string
 *                     description: The email of the assigned Secret Santa
 *                   accept:
 *                     type: boolean
 *                     description: Indicates whether the member has accepted the invitation
 *       401:
 *         description: Invalid request. User not authorized or not an administrator.
 *       404:
 *         description: Group or user does not exist, or user has not accepted the invitation.
 *       500:
 *         description: Some server error
 */
