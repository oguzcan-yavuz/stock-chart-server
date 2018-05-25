'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deleted = new Schema({
  deleted: String
});

module.exports = mongoose.model('Deleted', deleted);
