const sendResponse = (req, res, controller, params) => {
  controller(params)
    .then((results) => {
      if (results.length == 0) {
        return res.json({ success: 0, message: "No Entries Were Found" });
      }
      return res.status(200).json({ success: 1, results });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: 0, err });
    });
};

module.exports = sendResponse;
