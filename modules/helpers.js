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

export {
  handleError,
  evalSend,
}