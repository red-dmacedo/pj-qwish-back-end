const mongoose = require('mongoose');

const reqTypes = {
  reqString: { type: String, required: true },
  reqDate: { type: Date, required: true },
  reqNumber: { type: Number, required: true },
};

export default reqTypes;
