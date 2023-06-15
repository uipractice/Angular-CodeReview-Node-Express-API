const router = require('express').Router();
const db = require('../db/connection');
const ObjectId = require('mongojs').ObjectId;

// Deatils 
router.post('/details', (req, res)=>{
    const data = req.body;
    try {
        db.details.insert(data, (err, doc)=>{
            if(err){
                res.status(500).json({success: false, message : err});
            } else {
                res.json({success: true, message : 'Details data successfully inserted'})
            }
        })
    } catch(err){
        res.status(500).json({success: false, message : err});
    }
})

router.put('/details', (req, res)=>{
    const data = req.body;
    const id = req.body._id;
    delete data._id;
    try {
        db.details.update({ _id: new ObjectId(id) }, { $set: { ...data } }, { upsert: true }, (err, doc) => {
            if (err) {
                res.status(500).json({success: false, message : err});
            } else {
                res.json({success: true, message : 'Details data successfully updated'})
            }
        })
    } catch(err){
        res.status(500).json({success: false, message : err});
    }
})


router.get('/details', (req, res)=>{
    try {
        db.details.find({}, (err, doc) => {
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


// checklist

router.post('/check_list', (req, res)=>{
    const data = req.body;
    try {
        db.details.insert(data, (err, doc)=>{
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

router.put('/check_list', (req, res)=>{
    const data = req.body;
    const id = req.body._id;
    delete data._id;
    try {
        db.details.update({ _id: new ObjectId(id) }, { $set: { ...data } }, { upsert: true }, (err, doc) => {
            if (err) {
                res.status(500).json({success: false, message : err});
            } else {
                res.json({success: true, message : 'Check list data successfully updated'})
            }
        })
    } catch(err){
        res.status(500).json({success: false, message : err});
    }
})


router.get('/check_list', (req, res)=>{
    try {
        db.details.find({}, (err, doc) => {
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

// options

router.get('/options', (req, res)=>{
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