const mongoose = require('mongoose');
const reqTypes = require('./reqTypes');

const itemSchema = mongoose.Schema({
  product_id: reqTypes.string,
  name: reqTypes.string,
  img: String,
  description: String,
  price: reqTypes.number,
  weight: { type: Number, min: 0 },
  quantity: { type: Number, min: 0 },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
