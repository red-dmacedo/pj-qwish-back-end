const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const router = express.Router();
const List = require("../models/list.js");
const Item = require('../models/item.js');
const { handleError, evalSend } = require('../modules/helpers.js');

router.get("/", verifyToken, async (req, res) => { // get all lists
  try {
    const lists = await List.find({ author: req.user._id });
    evalSend(res, lists);
  } catch (err) {
    handleError(res, err);
  };
});

router.post("/", verifyToken, async (req, res) => { // create a list
  try {
    req.body.author = req.user._id; // assign author (only needed until the front-end is updated to include it)

    const newList = await List.create(req.body);
    evalSend(res, newList);
  } catch (err) {
    handleError(res, err);
  };
});

router.get("/shared", verifyToken, async (req, res) => { // get lists shared with the logged-in user
  try {
    const sharedLists = await List.find({ sharedWith: req.user._id });
    evalSend(res, newList);
  } catch (err) {
    handleError(err);
  };
});

router.get("/:listId", verifyToken, async (req, res) => { // get specific list
  try {
    const { listId } = req.params;
    const list = await List.findById(listId);
    if (!list) {
      evalSend(res, list);
    };

    list.items = list.items.filter(el => el._id); // remove blank entries if they exist (safety check)

    // Add full items to the list
    const itemIds = list.items.map(el => el._id);
    const items = await Item.find({ _id: itemIds });

    for (let [idx, itm] of list.items.entries()) {
      Object.assign(itm, items[idx]);
    };

    evalSend(res, newList);
  } catch (err) {
    handleError(res, err);
  };
});

router.put("/:listId", verifyToken, async (req, res) => { // update a list
  try {
    const { listId } = req.params;
    const updatedList = await List.findByIdAndUpdate(listId, req.body, { new: true });
    evalSend(res, updatedList);
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/:listId", verifyToken, async (req, res) => { // delete a list
  try {
    const { listId } = req.params;
    const list = await List.findByIdAndDelete(listId);
    evalSend(res, list);
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/:listId/:itemId", verifyToken, async (req, res) => { // delete an item from a list
  try {
    const { listId, itemId } = req.params;
    const list = await List.findByIdAndUpdate(listId, {
      $pull: { items: { _id: itemId, }, },
    }, { new: true });
    if (!list) return res.sendStatus(404);
    if (list.items.find(el => el._id.toString() === itemId)) {
      res.status(417);
      throw new Error('Failed to remove item');
    };

    const isReferenced = await List.findOne({ items: { $elemMatch: { '_id': itemId } } });
    if (!isReferenced) { const item = await Item.findByIdAndDelete(itemId); }; // Delete the item if it is no longer referenced by a list

    evalSend(res, list);
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/:listId/items/new", verifyToken, async (req, res) => { // add an item to a list
  try {
    const item = (req.body._id) ? await Item.findById(req.body._id) : await Item.create(req.body);

    const list = await List.findByIdAndUpdate(req.params.listId,
      { $push: { items: { _id: item._id, quantity: req.body.quantity } }, },
      { new: true }
    );

    evalSend(res, list, 404, 201);
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
