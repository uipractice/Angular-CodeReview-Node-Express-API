const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;
const _idValidation = require("../help/_idValidation");
const { check, validationResult } = require("express-validator");

const getTechnologies = (condition) => {
  return new Promise((resolve, reject) => {
    try {
      db.technologies.findOne(condition, (err, doc) => {
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
    check("name").not().isEmpty().withMessage("name is required"),
    check("isSonar").not().isEmpty().withMessage("isSonar is required"),
  ],
  async (req, res) => {
    // #swagger.tags = ['technologies']
    var errors = validationResult(req).array();
    if (errors && errors.length) {
      return res.status(400).json({ success: false, message: errors });
    }
    const data = req.body;
    try {
          const technologiesData = await getTechnologies({ name: data.name });
          if (technologiesData) {
            res
              .status(500)
              .json({ success: false, message: `This name already existed` });
          } else {
            db.technologies.insert(data, (err, doc) => {
              if (err) {
                res.status(500).json({ success: false, message: err });
              } else {
                res.json({
                  success: true,
                  message: "Technologies data successfully inserted",
                });
              }
            });
          }
        
    } catch (err) {
      res.status(500).json({ success: false, message: err });
    }
  }
);

router.put("/", async (req, res) => {
  const data ={name: req.body.name};
  const id = req.body._id;
  delete data._id;
  try {
    // #swagger.tags = ['technologies']
    if (id && _idValidation(id)) {
        const condition = { _id: new ObjectId(id) };
        const technologiesData = await getTechnologies(condition);
        if (technologiesData) {
            db.technologies.update(
              condition,
              { $set: { ...data } },
              (err, doc) => {
                if (err) {
                  res.status(500).json({ success: false, message: err });
                } else {
                  res.json({
                    success: true,
                    message: "Technologies data successfully updated",
                  });
                }
              }
            );
        } else {
          res.status(500).json({
            success: false,
            message: `Record not found in database`,
          });
        }
    } else {
      res.status(500).json({
        success: false,
        message: `Invalid _id`,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/", (req, res) => {
  try {
    // #swagger.tags = ['technologies']

     let condition = {};
     if (req.query.technologiesId) {
       condition = {
         _id: new ObjectId(req.query.technologiesId),
       };
     }
    db.technologies.find(condition, (err, doc) => {
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
    // #swagger.tags = ['technologies']
    db.technologies.remove(
      { _id: new ObjectId(req.query.technologiesId) },
      (err, doc) => {
        if (err) {
          res.status(500).json({ success: false, message: err });
        } else {
          res.json({ success: true, data: `Record successfully deleted` });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
