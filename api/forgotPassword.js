const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;
const { check, validationResult } = require("express-validator");
const randomGen = require("../hooks/randomGenerater");
const emailNotification = require("../hooks/email");
const config = require('../config');
router.post("/", [
    check("email").not().isEmpty().withMessage("Email is required")],async (req, res) => {
  // #swagger.tags = ['forgotPassword']
   var errors = validationResult(req).array();
   if (errors && errors.length) {
     return res.status(400).json({ success: false, message: errors });
   }
  try {
    let condition = { email: req.body.email };
    db.users.findOne(condition, (err1, doc1) => {
      if (err1) {
        console.log(err1);
        res.status(500).json({ success: false, message: err1 });
      } else {
        if(doc1){
            const resetToken = randomGen();
            db.users.update(
              condition,
              { $set: { resetToken: resetToken } },
              async (err2, doc2) => {
                if (err2) {
                  console.log(err2);
                  res.status(500).json({ success: false, message: err2 });
                } else {
                  const emailData = {
                    subject: `PASSWORD RESET LINK`,
                    to: req.body.email,
                    //   html: `<p>Click on this <a href="http:/localhost:3000/password/reset/${forgotToken}">link</a> to reset your password.</p>`,
                    html: `<body>
                            <p>Click <a href="${config.FE_HOST}/resetPassword/${resetToken}">here</a> to reset your password</p>
                            </body>`,
                  };
                  await emailNotification(emailData);
                  res.json({
                    success: true,
                    message:
                      "Reset password link successfully sent to your registered email",
                  });
                }
              }
            );
        } else {
            res.status(500).json({ success: false, message: `Record not found on this email` });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
});
module.exports = router;
