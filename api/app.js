const express = require('express');
const cors = require('cors');
const drive = require('./handlers/drive.js')

let app = express()

app.use(express.json());
app.use(cors());
app.use(drive)

module.exports = app