const crypto = require("crypto");

const randomGen = ()=> {
    return crypto.randomBytes(16).toString("hex");
}

module.exports = randomGen;