var pgp = require('pg-promise')();

require('dotenv').config();
const dbPass = process.env.DB_PASS;
const dbUrl = process.env.DB_URL;
var db = pgp(`postgres://postgres:${dbPass}@${dbUrl}:5432/postgres`)

module.exports = db;