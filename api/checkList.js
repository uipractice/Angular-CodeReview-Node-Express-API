const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;
const { check, validationResult } = require("express-validator");

router.post(
  "/",
  [
    check("detailsId").not().isEmpty().withMessage("detailsId is required"),
    check("data").not().isEmpty().withMessage("data is required"),
  ],
  async (req, res) => {
    var errors = validationResult(req).array();
    if (errors && errors.length) {
      return res.status(400).json({ success: false, message: errors });
    }
    const data = req.body;
    try {
      db.check_list.find({ detailsId: data.detailsId }, (err, checkListDoc) => {
        if (err) {
          res.status(500).json({ success: false, message: err });
        } else {
          if (checkListDoc.length) {
            db.check_list.updateMany(
              { detailsId: data.detailsId },
              { $addToSet: { data: data.data[0] } },
              (err, doc) => {
                if (err) {
                  res.status(500).json({ success: false, message: err });
                } else {
                  res.json({
                    success: true,
                    message: "Check list data successfully inserted",
                  });
                }
              }
            );
          } else {
            db.check_list.insert(data, (err, doc) => {
              if (err) {
                res.status(500).json({ success: false, message: err });
              } else {
                res.json({
                  success: true,
                  message: "Check list data successfully inserted",
                });
              }
            });
          }
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err });
    }
  }
);

router.put("/", (req, res) => {
  const data = req.body;
  try {
    db.check_list.updateMany(
      {
        detailsId: req.body.detailsId,
        "data.key":  req.body.data[0].key,
      },
      { $set: { "data.$.value": req.body.data[0].value } }, (err, doc)=>{
        if(err){
          res.status(500).json({ success: false, message: err });
        } else {
          res.json({
            success: true,
            message: "Check list data successfully updated",
          });  
        }
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/", (req, res) => {
  try {
    var condition = {};
    if (req.query.detailsId) {
      condition = { detailsId: req.query.detailsId };
    }
    db.check_list.find(condition, (err, doc) => {
      if (err) {
        res.status(500).json({ success: false, message: err });
      } else {
        res.json({ success: true, data: doc });
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
