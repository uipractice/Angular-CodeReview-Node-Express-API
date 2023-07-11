const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;
const { check, validationResult } = require("express-validator");
const _idValidation = require("../help/_idValidation");

router.post("/", (req, res) => {
  const data = req.body;
  const date = new Date();
  const dateNow = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  try {
    data.createdDate = dateNow;
    data.updatedDate = dateNow;
    db.left_nav.insert(data, (err, doc) => {
      if (err) {
        res.status(500).json({ success: false, message: err });
      } else {
        res.json({
          success: true,
          message: "Left nav data successfully inserted",
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
});

router.get(
  "/",
  [
    check("technicalStackId")
      .not()
      .isEmpty()
      .withMessage("technicalStackId is required"),
    check("technologiesId")
      .not()
      .isEmpty()
      .withMessage("technologiesId is required"),
  ],
  async (req, res) => {
    var errors = validationResult(req).array();
    if (errors && errors.length) {
      return res.status(400).json({ success: false, message: errors });
    }
    try {
      db.left_nav.find(
        {
          technologiesId: req.query.technologiesId,
          technicalStackId: req.query.technicalStackId,
        },
        (err, doc) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
          } else {
            res.json({ success: true, data: doc });
          }
        }
      );
    } catch (err) {
      res.status(500).json({ success: false, message: err });
    }
  }
);

router.delete("/", (req, res) => {
  try {
    if (req.query.leftNavId && _idValidation(req.query.leftNavId)) {
      db.left_nav.remove(
        { _id: new ObjectId(req.query.leftNavId) },
        (err, doc) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
          } else {
            res.json({ success: true, data: `Record successfully deleted` });
          }
        }
      );
    } else {
      res.status(500).json({ success: false, message: `Invalid leftNavId` });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
