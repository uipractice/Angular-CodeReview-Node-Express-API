const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;

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
router.post("/", async (req, res) => {
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
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/", async (req, res) => {
  const data = req.body;
  const id = req.body._id;
  const date = new Date();
  const dateNow = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  delete data._id;
  try {
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
          .json({ success: false, message: `This record already completed` });
      }
    } else {
      res
        .status(500)
        .json({ success: false, message: `Record not found in database` });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/", (req, res) => {
  try {
    let condition = {};
    if (req.query.detailsId) {
      condition = {
        _id: new ObjectId(req.query.detailsId),
      };
    }
    db.details.find(condition, (err, doc) => {
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
    db.details.remove({_id: new ObjectId(req.query.detailsId)},(err, doc) => {
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
