const router = require("express").Router();
const db = require("../db/connection");


router.get('/', (req, res)=>{
    try {
        db.options.find({}, (err, doc) => {
            if (err) {
                res.status(500).json({success: false, message : err});
            } else {
               res.json({success: true, data: doc});
            }
        })
    } catch(err){
        res.status(500).json({success: false, message : err});
    }
})

module.exports = router;
