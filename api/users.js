const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;
const { check, validationResult } = require("express-validator");
const _idValidation = require("../help/_idValidation");
const getDate = require("../help/getDate");
const { genSalt, genHash } = require("../hooks/bcrypt");
const getUser = (condition) => {
  return new Promise((resolve, reject) => {
    try {
      db.users.findOne(condition, (err, doc) => {
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
    check("firstName").not().isEmpty().withMessage("First name is required"),
    check("lastName").not().isEmpty().withMessage("Last name is required"),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Valid email is required"),
    check("isActive")
      .not()
      .isEmpty()
      .withMessage("Is active is required")
      .isIn([1, 0])
      .withMessage("Is active should be 1 or 0"),
    check("password").not().isEmpty().withMessage("Password is required"),
    check("role")
      .not()
      .isEmpty()
      .withMessage("role is required")
      .isIn(["admin", "user"])
      .withMessage("Role should be admin or user"),
  ],
  async (req, res) => {
    // #swagger.tags = ['Users']
    var errors = validationResult(req).array();
    if (errors && errors.length) {
      return res.status(400).json({ success: false, message: errors });
    }
    try {
      if (!(await getUser({ email: req.body.email }))) {
        const data = { firstName: req.body.firstName, lastName:req.body.lastName, isActive: req.body.isActive, email: req.body.email, role: req.body.role };
        const salt = await genSalt();
        const hash = await genHash(salt, req.body.password);
        const dateNow = getDate();
        data.createdDate = dateNow;
        data.updatedDate = dateNow;
        data.password = hash;
        data.salt = salt;
        data.createdBy = req.decode._id;
        db.users.insert(data, (err, doc) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
          } else {
            res.json({
              success: true,
              message: "User successfully created",
            });
          }
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: `User already existed` });
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
    check("firstName").not().isEmpty().withMessage("First name is required"),
    check("lastName").not().isEmpty().withMessage("Last name is required"),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Valid email is required"),
    check("isActive")
      .not()
      .isEmpty()
      .withMessage("Is active is required")
      .isIn([1, 0])
      .withMessage("Is active should be 1 or 0"),
    check("role")
      .not()
      .isEmpty()
      .withMessage("role is required")
      .isIn(["admin", "user"])
      .withMessage("Role should be admin or user"),
    check("_id").not().isEmpty().withMessage("_id is required"),
  ],
  async (req, res) => {
    // #swagger.tags = ['Users']
    var errors = validationResult(req).array();
    if (errors && errors.length) {
      return res.status(400).json({ success: false, message: errors });
    }
    try {
      if (_idValidation(req.body._id)) {
        const condition = { _id: new ObjectId(req.body._id) };
        if (await getUser(condition)) {
          const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            isActive: req.body.isActive,
            role: req.body.role,
          };
          const dateNow = getDate();
          data.updatedDate = dateNow;
          db.users.update(condition, { $set: { ...data } }, (err, doc) => {
            if (err) {
              console.log(err);
              res.status(500).json({ success: false, message: err });
            } else {
              res.json({
                success: true,
                message: "User successfully updated",
              });
            }
          });
        } else {
          res.status(500).json({ success: false, message: `User not existed` });
        }
      } else {
        res.status(500).json({ success: false, message: `Invalid _id` });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err });
    }
  }
);

router.get("/", async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    let condition = {};
    if (req.query.userId) {
      condition = {
        _id: new ObjectId(req.query.userId),
      };
    }
    if (req.query.email) {
      condition = {
        email: req.query.email,
      };
    }
    db.users.find(condition, { salt: 0, password: 0 }, (err, doc) => {
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
