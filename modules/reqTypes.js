const mongoose = require('mongoose');

const reqString = { type: String, required: true };
const reqDate = { type: Date, required: true };
const reqNumber = { type: Number, required: true };

module.exports = {
  reqString,
  reqDate,
  reqNumber,
};
