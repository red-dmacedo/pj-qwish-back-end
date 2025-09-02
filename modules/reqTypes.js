const mongoose = require('mongoose');

const reqTypes = {
  string: { type: String, required: true },
  date: { type: Date, required: true },
  number: { type: Number, required: true },
};

export default reqTypes;
