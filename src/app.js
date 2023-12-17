//app.js
const express = require('express');
const app = express();
const port = 3000;
const host = '0.0.0.0';

// Import Swagger documentation configuration
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swaggerConfig.js');

// Serve Swagger documentation at /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect to the MongoDB database
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/secretsanta');

// Middleware to parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import and use routes for user, group, and member 
const userRoute = require('./routes/userRoute');
app.use('/users', userRoute);

const groupRoute = require('./routes/groupRoute');
app.use('/groups', groupRoute);

const memberRoute = require('./routes/memberRoute');
app.use('/members', memberRoute);

// Start the server and listen on the specified port and host
app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
