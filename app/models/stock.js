'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stock = new Schema({
  stock: Object,
});

module.exports = mongoose.model('Stock', stock);
