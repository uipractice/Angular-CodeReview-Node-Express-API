const router = require("express").Router();
const db = require("../db/connection");
const ObjectId = require("mongojs").ObjectId;

router.post('/', (req, res)=>{
    const data = req.body;
    try {
        db.check_list.insert(data, (err, doc)=>{
            if(err){
                res.status(500).json({success: false, message : err});
            } else {
                res.json({success: true, message : 'Check list data successfully inserted'})
            }
        })
    } catch(err){
        res.status(500).json({success: false, message : err});
    }
})

router.put('/', (req, res)=>{
    const data = req.body;
    const id = req.body._id;
    delete data._id;
    try {
        db.check_list.update(
          { _id: new ObjectId(id) },
          { $set: { ...data } },
          { upsert: true },
          (err, doc) => {
            if (err) {
              res.status(500).json({ success: false, message: err });
            } else {
              res.json({
                success: true,
                message: "Check list data successfully updated",
              });
            }
          }
        );
    } catch(err){
        res.status(500).json({success: false, message : err});
    }
})

router.get('/', (req, res)=>{
    try {
        db.check_list.find({}, (err, doc) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
          } else {
            res.json({ success: true, data: doc });
          }
        });
    } catch(err){
        res.status(500).json({success: false, message : err});
    }
})

module.exports = router;