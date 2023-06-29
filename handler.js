// 'use strict';
// const routing = require("./routing/index");
// const serverless = require("serverless-http");
// module.exports.hello = async (event) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v1.0! Your function executed successfully!',
//         input: event,
//       },
//       null,
//       2
//     ),
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };

"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
const routing = require("./routing/index");
const bodyParser = require("body-parser");
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/api", routing);
app.get("/", (req, res) => {
  res.json("Hello i am calling1111111111111");
});
const serverless = require("serverless-http");
module.exports.hello = serverless(app);
