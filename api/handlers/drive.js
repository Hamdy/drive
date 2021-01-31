var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler')

var drive = require('../../drive.js')

router.get('/', (req, res) => {
    res.json({"one": 1})    
})

// create new
router.post('/drive', asyncHandler(async (req, res) => {

    const key = await drive.create()
    res.json({"key": key})    
}))


module.exports = router
