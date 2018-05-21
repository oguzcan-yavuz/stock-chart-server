'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const router = require('./app/routes/index.js');
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;

let app = express();

mongoose.connect(MONGO_URI);

const corsOptions = {
  origin: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
};

app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(router);
app.listen(PORT, () => {
  console.log("Server is listening on " + PORT);
});
