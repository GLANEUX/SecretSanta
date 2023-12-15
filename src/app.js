const express = require('express')
const app = express()
const port = 3000
const host ='0.0.0.0';

const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swaggerConfig.js');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/secretsanta');

app.use(express.urlencoded());
app.use(express.json());

const userRoute = require('./routes/userRoute');
app.use('/users', userRoute);

const groupRoute = require('./routes/groupRoute');
app.use('/groups', groupRoute);

const memberRoute = require('./routes/memberRoute');
app.use('/members', memberRoute);

app.listen(port,host);