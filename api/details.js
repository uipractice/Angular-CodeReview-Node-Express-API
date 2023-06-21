const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;
const { check, validationResult } = require("express-validator");
const _idValidation = require("../help/_idValidation");
const getDetils = (condition) => {
  return new Promise((resolve, reject) => {
    try {
      db.details.findOne(condition, (err, doc) => {
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
    check("account").not().isEmpty().withMessage("account is required"),
    check("project").not().isEmpty().withMessage("project is required")
  ],
  async (req, res) => {
    var errors = validationResult(req).array();
    if(errors && errors.length){
      return res.status(400).json({ success: false, message: errors });
    }
    const data = req.body;
    const date = new Date();
    const dateNow = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    try {
      const condition = {
        account: data.account,
        project: data.project,
        createdDate: dateNow,
      };
      const detailsData = await getDetils(condition);
      if (detailsData) {
        if (detailsData.status != "completed") {
          data.updatedDate = dateNow;
          db.details.update(condition, { $set: { ...data } }, (err, doc) => {
            if (err) {
              res.status(500).json({ success: false, message: err });
            } else {
              res.json({
                success: true,
                message: "Details data successfully updated",
              });
            }
          });
        } else {
          res
            .status(500)
            .json({ success: false, message: `This record already completed` });
        }
      } else {
        data.createdDate = dateNow;
        data.updatedDate = dateNow;
        db.details.insert(data, (err, doc) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
          } else {
            res.json({
              success: true,
              message: "Details data successfully inserted",
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err });
    }
  }
);

router.put(
  "/",
  [
    check("account").not().isEmpty().withMessage("account is required"),
    check("project").not().isEmpty().withMessage("project is required"),
  ],
  async (req, res) => {
    var errors = validationResult(req).array();
    if (errors && errors.length) {
      return res.status(400).json({ success: false, message: errors });
    }
    const data = req.body;
    const id = req.body._id;
    const date = new Date();
    const dateNow = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    delete data._id;
    try {
      if (_idValidation(id)) {
        const condition = { _id: new ObjectId(id) };
        const detailsData = await getDetils(condition);
        if (detailsData) {
          if (detailsData.status != "completed") {
            data.updatedDate = dateNow;
            db.details.update(condition, { $set: { ...data } }, (err, doc) => {
              if (err) {
                res.status(500).json({ success: false, message: err });
              } else {
                res.json({
                  success: true,
                  message: "Details data successfully updated",
                });
              }
            });
          } else {
            res
              .status(500)
              .json({
                success: false,
                message: `This record already completed`,
              });
          }
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
  try {
    var pipeline = [
      {
        $lookup: {
          from: "technologies",
          let: { technologiesObjId: { $toObjectId: "$technologiesId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$technologiesObjId"] } } },
            { $project: { _id: 0, technicalStackId: 0 } },
          ],
          as: "technologies",
        },
      },
      {
        $unwind: {
          path: "$technologies",
          preserveNullAndEmptyArrays: true,
        },
      },
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
        $unwind: {
          path: "$technical_stack",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    if (req.query.detailsId) {
      pipeline = [
        ...pipeline,
        { $match: { _id: new ObjectId(req.query.detailsId) } },
      ];
    }
    db.details.aggregate(pipeline, (err, doc) => {
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
    if (req.query.detailsId && _idValidation(req.query.detailsId)) {
      db.details.remove(
        { _id: new ObjectId(req.query.detailsId) },
        (err, doc) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
          } else {
            res.json({ success: true, data: `Record successfully deleted` });
          }
        }
      );
    } else {
      res.status(500).json({ success: false, message: `Invalid _id` });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
