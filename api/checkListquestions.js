const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;
const { check, validationResult } = require("express-validator");
const _idValidation = require("../help/_idValidation");

router.post("/",(req, res) => {
    const data = req.body;
    const date = new Date();
    const dateNow = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    try {
        data.createdDate = dateNow;
        data.updatedDate = dateNow;
        db.check_list_questions.insert(data, (err, doc) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
          } else {
            res.json({
              success: true,
              message: "Check list questions data successfully inserted",
            });
          }
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err });
    }
  }
);

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
      const step = req.query.step;
      db.check_list_questions.find(
        {
          technologiesId: req.query.technologiesId,
          technicalStackId: req.query.technicalStackId,
        },
        (err, doc) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
          } else {
            if (step) {
              doc[0].data = [doc[0].data[step - 1]];
            }
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
    if (
      req.query.checkListQuestionsId &&
      _idValidation(req.query.checkListQuestionsId)
    ) {
      db.check_list_questions.remove(
        { _id: new ObjectId(req.query.checkListQuestionsId) },
        (err, doc) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
          } else {
            res.json({ success: true, data: `Record successfully deleted` });
          }
        }
      );
    } else {
      res
        .status(500)
        .json({ success: false, message: `Invalid checkListQuestionsId` });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
