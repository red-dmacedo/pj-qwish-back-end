const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const router = express.Router();
const List = require("../models/list.js");
const Item = require('../models/item.js');
const { handleError, evalSend } = require('../modules/helpers.js');

router.get("/", verifyToken, async (req, res) => { // get all lists
  try {
    const lists = await List.find({ author: req.user._id });
    return res.status(200).json(lists);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

router.post("/", verifyToken, async (req, res) => { // create a list
  try {
    req.body.author = req.user._id;

    const newList = await List.create(req.body);
    return res.status(201).json(newList);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

router.get("/shared", verifyToken, async (req, res) => { // get lists shared with the logged-in user
  try {
    const sharedLists = await List.find({ sharedWith: req.user._id });
    if (!sharedLists) return res.sendStatus(404);
    return res.status(200).json(sharedLists);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  };
});

router.get("/:listId", verifyToken, async (req, res) => { // get specific list
  try {
    const { listId } = req.params;
    const list = await List.findById(listId);
    /* Ask James if he can explain this commented section:
    const list = await List.findOne({
      _id: listId,
      $or: [
        //we allow to find by id for author and one of persons sharedWith
        { author: req.user._id },
        { sharedWith: req.user._id }, // works even though it's an array
      ],
    });
    */
    if (!list) {
      return res.sendStatus(404);
    };

    list.items = list.items.filter(el => el._id); // remove blank entries if they exist (safety check)

    // Add full items to the list
    const itemIds = list.items.map(el => el._id);
    const items = await Item.find({ _id: itemIds });

    for (let [idx, itm] of list.items.entries()) {
      Object.assign(itm, items[idx]);
    };

    return res.status(200).json(list);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

router.put("/:listId", verifyToken, async (req, res) => { // update a list
  try {
    const { listId } = req.params;
    const {
      name,
      items = [],
      description = "",
      closeDate = null,
      sharedWith = [],
    } = req.body;
    if (!listId || !name) {
      return res.sendStatus(423);
    }
    const updatedList = await List.findByIdAndUpdate(
      listId,
      {
        name,
        author: req.user._id,
        items,
        description,
        closeDate,
        sharedWith,
      },
      { new: true }
    );

    return res.status(200).json(updatedList);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

router.delete("/:listId", verifyToken, async (req, res) => { // delete a list
  try {
    const { listId } = req.params;
    if (!listId) {
      return res.sendStatus(423);
    }
    const list = await List.findById(listId);
    if (!list) {
      return res.sendStatus(404);
    }
    await List.findByIdAndDelete(listId);
    return res.status(200).json(list);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
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
      throw new Error('Failed to remove item');
    };

    const isItemStillUsed = await List.findOne({ items: { $elemMatch: { '_id': itemId } } });

    // Delete the item if it is no longer referenced by a list
    if (!isItemStillUsed) { const item = await Item.findByIdAndDelete(itemId); };

    return res.status(200).json(list);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

router.post("/:listId/items/new", verifyToken, async (req, res) => { // add an item to a list
  try {
    const item = (req.body._id) ? await Item.findById(req.body._id) : await Item.create(req.body);

    const list = await List.findByIdAndUpdate(req.params.listId,
      { $push: { items: { _id: item._id, quantity: req.body.quantity } }, },
      { new: true }
    );

    return res.status(201).json(list);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
