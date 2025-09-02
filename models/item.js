const mongoose = require('mongoose');
const { reqString, reqNumber } = require('../modules/reqTypes');

const itemSchema = mongoose.Schema({
  product_id: reqString,
  name: reqString,
  img: String,
  description: String,
  price: reqNumber,
  weight: { type: Number, min: 0 },
  quantity: { type: Number, min: 0 },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
