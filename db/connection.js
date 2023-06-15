const config = require("../config");
const mongojs = require('mongojs');
const db = mongojs(`mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@cluster0.juatdby.mongodb.net/${config.DATABASE}`, ['details']);

module.exports = db;