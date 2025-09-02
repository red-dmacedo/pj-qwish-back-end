const Item = require('../models/item.js');
const express = require('express');
const router = express.Router();
import { handleError, evalSend, expandListItems } from '../modules/helpers.js';
// const { handleError, evalSend, expandListItems } = require('../modules/helpers.js');

router.post('/', async (req, res) => { // create or retrieve an item
  try {
    const preExistingItem = await Item.findOne({ product_id: req.body.product_id });
    if (preExistingItem) { evalSend(res, preExistingItem, 201) }
    else {
      const createdItem = await Item.create(req.body);
      evalSend(res, createdItem, 404, 201);
    };
  } catch (err) {
    handleError(res, err);
  };
});

router.get('/', async (req, res) => { // get all items in the database
  try {
    const foundItems = await Item.find();
    evalSend(res, foundItems);
  } catch (err) {
    handleError(res, err);
  };
});

router.get('/:itemId', async (req, res) => { // get specific item
  try {
    const { itemId } = req.params;
    const foundItem = await Item.findById(itemId);
    evalSend(res, foundItem);
  } catch (err) {
    handleError(res, err);
  };
});

router.delete('/:itemId', async (req, res) => { // delete an item
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.itemId);
    evalSend(res, deletedItem);
  } catch (err) {
    handleError(res, err);
  };
});

router.put('/:itemId', async (req, res) => { // update an item
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.itemId, req.body, { new: true });
    evalSend(res, updatedItem);
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/many', async (req, res) => { // retrieve array of items
  try {
    const foundItems = await Item.find({ _id: req.body.itemIds });
    evalSend(res, foundItems);
  } catch (err) {
    handleError(res, err);
  };
});

module.exports = router;
