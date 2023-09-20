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
      // if (data.technicalStackId && _idValidation(data.technicalStackId)) {
        // const technicalStackData = await getTechnicalStack({
        //   _id: new ObjectId(data.technicalStackId),
        // });
        // if (technicalStackData) {
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
        // } else {
        //   res
        //     .status(500)
        //     .json({ success: false, message: `Invalid technical stack` });
        // }
      // } else {
      //   res
      //     .status(500)
      //     .json({ success: false, message: `Invalid technicalStackId` });
      // }
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
      // if (data.technicalStackId && _idValidation(data.technicalStackId)) {
        const condition = { _id: new ObjectId(id) };
        const technologiesData = await getTechnologies(condition);
        if (technologiesData) {
          // const technicalStackData = await getTechnicalStack({
          //   _id: new ObjectId(data.technicalStackId),
          // });
          // if (technicalStackData) {
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
          // } else {
          //   res.status(500).json({
          //     success: false,
          //     message: `Invalid technical stack`,
          //   });
          // }
        } else {
          res.status(500).json({
            success: false,
            message: `Record not found in database`,
          });
        }
      // } else {
      //   res.status(500).json({
      //     success: false,
      //     message: `Invalid technicalStackId`,
      //   });
      // }
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
    var pipeline = [
      {
        $lookup: {
          let: { technicalStackObjId: { $toObjectId: "$technicalStackId" } },
          from: "technical_stack",
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$technicalStackObjId"] } } },
            { $project: { _id: 0 } },
          ],
          as: "technical_stack",
        },
      },
      {
        $unwind: "$technical_stack",
      },
    ];
    if (req.query.technicalStackId) {
      pipeline = [
        ...pipeline,
        {
          $match: {
            technicalStackId: req.query.technicalStackId,
          },
        },
      ];
    }
    db.technologies.aggregate(pipeline, (err, doc) => {
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
