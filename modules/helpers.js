const List = require("../models/list");
const Item = require('../models/item');

const handleError = (res, err) => {
  res.json({ err: err.message });
};

const evalSend = (res, sendObject, errorCode = 404, successCode = 200) => {
  if (!sendObject) {
    res.status(errorCode);
    throw new Error('Data not found');
  };

  return res.status(successCode).json(sendObject);
};

const expandListItems = async (list) => {
  list.items = list.items.filter(el => el._id); // remove blank entries if they exist (safety check)

  // Add full items to the list
  const itemIds = list.items.map(el => el._id);
  const items = await Item.find({ _id: itemIds });

  for (let [idx, itm] of list.items.entries()) {
    Object.assign(itm, items[idx]);
  };

  return list;
};

module.exports = {
  handleError,
  evalSend,
  expandListItems,
}