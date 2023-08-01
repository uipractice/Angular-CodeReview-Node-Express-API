const router = require("express").Router();
const details = require("../api/details");
const checklist = require("../api/checkList");
const options = require("../api/options");
const technicalStack = require("../api/technicalStack");
const technologies = require("../api/technologies");
const checkListQuestions = require("../api/checkListquestions");
const lefNavData = require("../api/leftNavData");
const users = require("../api/users");
const login = require("../api/login");
const user = require("../api/user");

const { tokenVerify } = require("../hooks/authentication");

const hasPermission = require("../hooks/permissionManager");

router.use("/details", tokenVerify, details);

router.use("/checklist", tokenVerify, checklist);

router.use("/options", tokenVerify, options);

router.use("/technicalStack", tokenVerify, technicalStack);

router.use("/technologies", tokenVerify, technologies);

router.use(
  "/checkListQuestions",
  tokenVerify,
  hasPermission(["admin"]),
  checkListQuestions
);

router.use("/lefNavData", tokenVerify, lefNavData);

router.use("/users", tokenVerify, hasPermission(["admin"]), users);

router.use("/user", tokenVerify,  user);

router.use("/login", login);

module.exports = router;
