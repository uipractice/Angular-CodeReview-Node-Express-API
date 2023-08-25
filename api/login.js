const router = require("express").Router();
const db = require("../db/connection");
const { check, validationResult } = require("express-validator");
const { genHash } = require("../hooks/bcrypt");
const { tokenCreation } = require("../hooks/authentication");

router.post(
  "/",
  [
    check("email").not().isEmpty().withMessage("Email is required").isEmail().withMessage("Valid email is required"),
    check("password").not().isEmpty().withMessage("password is required")
  ],
  async (req, res) => {
    // #swagger.tags = ['login']
    var errors = validationResult(req).array();
    if (errors && errors.length) {
      return res.status(400).json({ success: false, message: errors });
    }
    try {
      const { email, password } = req.body;
      db.users.findOne({ email: email }, async (err, doc) => {
        if (err) {
          res.status(500).json({ success: false, message: err });
        } else {
          if (doc) {
            const hash = await genHash(doc.salt, password);
            if (doc.password === hash) {
              delete doc.salt;
              delete doc.password;
              const token = await tokenCreation(doc);
              res.json({
                success: true,
                token: token,
              });
            } else {
              res
                .status(401)
                .json({ success: false, message: `Invalid password` });
            }
          } else {
            res
              .status(401)
              .json({ success: false, message: "Email not existed" });
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
