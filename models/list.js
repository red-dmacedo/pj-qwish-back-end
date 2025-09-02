const mongoose = require("mongoose");
const {reqString} = require('../modules/reqTypes');

const listSchema = new mongoose.Schema(
  {
    name: reqString,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    items: [{
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Item", },
      quantity: { type: Number, min: 0, },
    }],
    description: String,
    closeDate: Date,
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", }],
  },
  { timestamps: true }
);

const List = mongoose.model("List", listSchema);

module.exports = List;
