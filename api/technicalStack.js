const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;
const _idValidation = require("../help/_idValidation");

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

router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const condition = { name: data.name };
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
});


router.put("/", async (req, res) => {
  const data = req.body;
  const id = req.body._id;
  delete data._id;
  try {
    if(id && _idValidation(id)){
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
});


router.get("/", (req, res) => {
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
