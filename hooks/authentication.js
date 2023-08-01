"use strict";
const jwt = require("jsonwebtoken");
const tokenCreation = (data) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.sign(data, "ui-practice-secret", (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

const tokenVerify = (req, res, next) => {
  try {
    var token = req.headers.authorization;
    if (token) {
      token = token.replace("Bearer ", "");
      jwt.verify(token, "ui-practice-secret", (err, decode) => {
        if (err) {
          res.status(401).json(err);
        } else {
          if (decode.email && decode._id) {
            req.decode = decode;
            next();
          } else {
            res
              .status(401)
              .json({ success: false, message: "Invalid JWT user" });
          }
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (err) {
    res.status(401).json(err);
  }
};

module.exports = { tokenCreation, tokenVerify };
