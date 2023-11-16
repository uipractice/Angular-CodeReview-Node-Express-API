const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;
const _idValidation = require("../help/_idValidation");
const { check, validationResult } = require("express-validator");
const PrepareExcel = require("../hooks/PrepareExcel");
const email = require("../hooks/email");
router.post(
  "/",
  [
    check("detailsId").not().isEmpty().withMessage("detailsId is required"),
    check("toEmail").not().isEmpty().withMessage("toEmail is required"),
  ],
  async (req, res) => {
    // #swagger.tags = ['report-sending']
    var errors = validationResult(req).array();
    if (errors && errors.length) {
      return res.status(400).json({ success: false, message: errors });
    }
    try {
      db.check_list
        .findOne({ detailsId: req.body.detailsId },async(err, doc) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
          } else {
            if(doc){
                let condition = { _id: new ObjectId(req.body.detailsId) };
                db.details.findOne(condition, async(detErr, detDoc)=>{
                  if(detErr){
                    res.status(500).json({ success: false, message: detErr });
                  } else {
                    for (const key in detDoc) {
                      if (
                        detDoc.hasOwnProperty(key) &&
                        !doc.hasOwnProperty(key)
                      ) {
                        doc[key] = detDoc[key];
                      }
                    }
                    
                    var excelContent = await PrepareExcel(doc);
                    excelData = {
                      to : req.body.toEmail,
                      subject : `${doc.account}-${doc.project}: Code review check list`,
                      body : "Please review the code review checklist provided in the attached Excel file.",
                      attachments : [
                        {
                          content: excelContent.toString("base64"),
                          filename: "code-review-checklist.xlsx",
                          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                          disposition: "attachment",
                        },
                      ]
                    }
                    await email(excelData);
                    res.json({ success: true, data: "Report sent successfully" });
                  }
                });
                
            } else {
                res.status(500).json({ success: false, message: 'No data found on this detailsId' });
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
