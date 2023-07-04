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

router.get("/", (req, res) => {
  try {
    const type = req.query.type;
    db.check_list_questions.find({}, (err, doc) => {
      if (err) {
        res.status(500).json({ success: false, message: err });
      } else {
        for(let i = 0; i < doc[0].data.length; i++){
          if(doc[0].data[i].key == type){
            doc[0].data = [doc[0].data[i]];
            break;
          }
        }
        res.json({ success: true, data: doc });
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

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
