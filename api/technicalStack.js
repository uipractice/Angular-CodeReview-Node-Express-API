const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;
const _idValidation = require("../help/_idValidation");
const { check, validationResult } = require("express-validator");


const getTechnicalStack = (condition) => {
  return new Promise((resolve, reject) => {
    try {
      db.technical_stack.findOne(condition, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

router.post(
  "/",
  [
    check("name").not().isEmpty().withMessage("name is required")
  ],
  async (req, res) => {
    // #swagger.tags = ['technical-stack']
    var errors = validationResult(req).array();
    if (errors && errors.length) {
      return res.status(400).json({ success: false, message: errors });
    }
    const data = { name: req.body.name };
    try {
      const condition = { data };
      const technicalStackData = await getTechnicalStack(condition);
      if (technicalStackData) {
        res
          .status(500)
          .json({ success: false, message: `This name already existed` });
      } else {
        db.technical_stack.insert(data, (err, doc) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
          } else {
            res.json({
              success: true,
              message: "Technical stack data successfully inserted",
            });
          }
        });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err });
    }
  }
);


router.put(
  "/",
  [
    check("name").not().isEmpty().withMessage("name is required"),
    check("_id").not().isEmpty().withMessage("id is required"),
  ],
  async (req, res) => {
    // #swagger.tags = ['technical-stack']
    var errors = validationResult(req).array();
    if (errors && errors.length) {
      return res.status(400).json({ success: false, message: errors });
    }

    const data = ({ name, _id } = req.body);
    const id = req.body._id;
    delete data._id;
    try {
      if (id && _idValidation(id)) {
        const condition = { _id: new ObjectId(id) };
        const technicalStackData = await getTechnicalStack(condition);
        if (technicalStackData) {
          db.technical_stack.update(
            condition,
            { $set: { ...data } },
            (err, doc) => {
              if (err) {
                res.status(500).json({ success: false, message: err });
              } else {
                res.json({
                  success: true,
                  message: "Technical stack data successfully updated",
                });
              }
            }
          );
        } else {
          res
            .status(500)
            .json({ success: false, message: `Record not found in database` });
        }
      } else {
        res.status(500).json({ success: false, message: `Invalid _id` });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err });
    }
  }
);


router.get("/", (req, res) => {
  // #swagger.tags = ['technical-stack']
  try {
    let condition = {};
    if (req.query.technicalStackId) {
      condition = {
        _id: new ObjectId(req.query.technicalStackId),
      };
    }
    db.technical_stack.find(condition, (err, doc) => {
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

router.delete("/", (req, res) => {
  // #swagger.tags = ['technical-stack']
  try {
    if (
      req.query.technicalStackId &&
      _idValidation(req.query.technicalStackId)
    ) {
      db.technical_stack.remove(
        { _id: new ObjectId(req.query.technicalStackId) },
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
        .json({ success: false, message: `Invalid technicalStackId` });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});



module.exports = router;
