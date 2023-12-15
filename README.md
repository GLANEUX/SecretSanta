# 🎄 Develop an API for a "Secret Santa" Application in Node.js 🎁


# USERS
* `email`: required, unique, email type
* `password`: required, string

# GROUPS
* `user_id`: required, string
* `name`: required, string


# MEMBERS
* `group_id`: required, string
* `user_id`: required, string
* `santa_id`: string

Ajouter des create update

# /USERS
-   `/users/register` return email, [email correct & can't already exist, secure password] (`POST`)
-   `/users/login` return a token, [good mdp & email] (`POST`) `TOKEN`
- 🔐`/users/:user_id` return user delete (`DELETE`)
- 🔐`/users/:user_id` return the new email (`PUT`)
- 🔒`/users` return all the users (`GET`)

# /GROUPS
- 🔒`/groups/new` return group name & you're admin (`POST`)
- 🔐`/groups/:group_id` return delete group (`DELETE`)
- 🔐`/groups/:group_id` return modified name (`PUT`)
- 🔐`/groups/:group_id` return your santa [admin see all] (`GET`)
- 🔐`/groups/:group_id` return list of all and blend (`POST`)
- 🔐`/groups/:user_id` return all group were they are (`GET`)

# MEMBERS
- 🔐`/members/:group_id/secretsanta` return list of all and blend (`POST`)
- 🔐`/members/:user_id/:group_id` return a token (`POST`) TOKEN
- 🔐`/members/:user_id/:group_id` return delete user (`DELETE`) 
- 🔐`/members/:user_id/:group_id/accept` return accept ok (`POST`) TOKEN need
- 🔐`/members/:user_id/:group_id/decline` return supprimer (`POST`) TOKEN need




## Objective:

Create an API in Node.js for a "Secret Santa" application.
The API should enable users to register, create groups, and secretly assign people to each group member.

Features to Implement:

# 👤 1. User Registration and Authentication
	
- User account creation with authentication.
- Managing password security.
- Implementing JWT authentication.


# 🧑‍🤝‍🧑 2. Creation and Management of Groups
	
- Allowing users to create groups.	
- Inviting members via email.	
- Accepting or declining invitations.


# 🎅 3. Secret Assignment of "Secret Santas"

- Algorithm to randomly assign a group member to each participant.	
- Ensuring no one ends up with their own name.


# 🔴 Requirements
	
- ✔️ Git Flow or Github flow	
- 〰️ Comment your code	
- 💯 Complete README to initialize the project	
- 💻 Code quality and clarity	
- 🔒 API security	


- 📄 API documentation / Postman Collection


update créated


id nom owen create update

usr group accepter