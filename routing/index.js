const router = require('express').Router();
const details = require("../api/details");
const checklist = require("../api/checkList");
const options = require('../api/options');
router.use('/details', details);
router.use('/checklist', checklist);
router.use('/options', options);


module.exports = router;