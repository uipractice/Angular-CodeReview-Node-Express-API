const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;

router.get("/", async (req, res) => {
  // #swagger.tags = ['user']
  try {
    let condition = { _id: new ObjectId(req.decode._id) };
    db.users.findOne(condition, { salt: 0, password: 0 }, (err, doc) => {
      if (err) {
        res.status(500).json({ success: false, message: err });
      } else {
        res.json({ success: true, data: doc });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
});
module.exports = router;
