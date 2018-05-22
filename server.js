'use strict';

require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const ws = require('./app/ws/ws.js');

let app = express();

const corsOptions = {
  origin: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
};

app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(express.json());
let server = app.listen(PORT, () => {
  console.log("Server is listening on " + PORT);
});
ws(server);
