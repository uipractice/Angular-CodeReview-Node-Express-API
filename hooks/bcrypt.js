const bcrypt = require("bcrypt");

const genSalt = () => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        resolve(salt);
      }
    });
  });
};

const genHash = (salt, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

module.exports = {
  genSalt,
  genHash,
};
