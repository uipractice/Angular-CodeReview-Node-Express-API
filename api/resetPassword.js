const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;
const { check, validationResult } = require("express-validator");
const { genSalt, genHash } = require("../hooks/bcrypt");
const getDate = require("../help/getDate");
router.post(
  "/",
  [
    check("resetToken").not().isEmpty().withMessage("resetToken is required"),
    check("password").not().isEmpty().withMessage("resetToken is required"),
  ],
  async (req, res) => {
    // #swagger.tags = ['resetPassword']
    var errors = validationResult(req).array();
    if (errors && errors.length) {
      return res.status(400).json({ success: false, message: errors });
    }
    try {
      let condition = { resetToken: req.body.resetToken };
      db.users.findOne(condition, async(err1, doc1) => {
        if (err1) {
          console.log(err1);
          res.status(500).json({ success: false, message: err1 });
        } else {
          if (doc1) {
            const salt = await genSalt();
            const hash = await genHash(salt, req.body.password);
            const dateNow = getDate();
            const updatedDate = dateNow;
            db.users.update(
              condition,
              { $set: { salt: salt, password: hash, updatedDate: updatedDate, resetToken: '' } },
              async (err2, doc2) => {
                if (err2) {
                  console.log(err2);
                  res.status(500).json({ success: false, message: err2 });
                } else {
                  res.json({
                    success: true,
                    message:
                      "Password succesfully updated",
                  });
                }
              }
            );
          } else {
            res.status(500).json({
              success: false,
              message: `Invalid reset token`,
            });
          }
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err });
    }
  }
);
module.exports = router;
