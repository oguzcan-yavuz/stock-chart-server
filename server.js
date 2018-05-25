'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ws = require('./app/ws/ws.js');
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

let app = express();

mongoose.connect(MONGO_URI);

const corsOptions = {
  origin: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
};

app.use(cors(corsOptions));
app.use(express.json());

let server = app.listen(PORT, () => {
  console.log("Server is listening on " + PORT);
});

ws(server);
