const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const user = require('./routes/user.routes');
const group = require('./routes/group.routes');

// Initialize Express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

// Configure middleware
app.use(express.json());

app.use('/user', user);
app.use('/group', group);

exports.app = app;