const router = require('express').Router();
const details = require("../api/details");
const checklist = require("../api/checkList");
const options = require('../api/options');
const technicalStack = require('../api/technicalStack');
const technologies = require('../api/technologies');
const checkListQuestions = require("../api/checkListquestions");
const lefNavData = require('../api/leftNavData');
const users = require('../api/users');
const login = require('../api/login');
const { tokenVerify } = require('../hooks/authentication');

router.use("/details", details);
router.use('/checklist', checklist);
router.use('/options', options);
router.use('/technicalStack', technicalStack);
router.use("/technologies", technologies);
router.use("/checkListQuestions", checkListQuestions);
router.use("/lefNavData", lefNavData);
router.use("/users", tokenVerify, users);
router.use('/login', login);

module.exports = router;