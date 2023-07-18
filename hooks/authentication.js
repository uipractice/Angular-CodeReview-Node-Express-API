"use strict";
const jwt = require("jsonwebtoken");
const tokenCreation = (data) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.sign(data, "secret", (err, token) => {
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
  var token = req.headers.authorization;
  token = token.replace("Bearer ", "");
  try {
    jwt.verify(token, "secret", (err, decode) => {
      if (err) {
        res.status(401).json(err);
      } else {
        let email = req.body.email || req.query.email;
        if (decode.email == email) {
          next();
        } else {
          res.status(401).json(`Invalid JWT user`);
        }
      }
    });
  } catch (err) {
    res.status(401).json(err);
  }
};

module.exports = { tokenCreation, tokenVerify };
