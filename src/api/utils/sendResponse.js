module.exports = {
  sendResponse: (req, res, controller, params) => {
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
  },

  sendAuthResponse: (req, res, controller, params, sign) => {
    controller(params)
      .then((results) => {
        if (results.length == 0) {
          return res.json({ success: 0, message: "DB error" });
        }

        params.password = undefined;
        params = JSON.parse(JSON.stringify(params));
        const jwt = sign(params, "hashkey", { expiresIn: "16h" });
        res.cookie("access-token", jwt, { maxAge: 3600*1000 });
        return res.status(200).json({
          success: 1,
          results,
          message: "Successful Authentication!",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ success: 0, err });
      });
  },
};
