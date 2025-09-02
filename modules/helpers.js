const handleError = (res, err) => {
  switch (res.statusCode) {
    case 404:
      res.json({ err: err.message });
      break;
    default:
      res.status(500).json({ err: err.message });
  };
};

const evalSend = (res, sendObject, successCode = 200) => {
  if (!sendObject) {
    res.status(404);
    throw new Error('Data not found');
  };

  return res.status(successCode).json(sendObject);
};

export {
  handleError,
  evalSend,
}