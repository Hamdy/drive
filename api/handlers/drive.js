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
    return res.json({"key": key})    
}))

// list dir
// download file
router.get('/drive/:id/*', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = req.url.replace(`/drive/${req.params.id}`, "")

    if (filepath === ""){
        filepath = "/"
    }

    var entry = null

    try {
        entry = await driveObj.promises.stat(filepath)
    } catch (e) {
        return res.status(404).json('');
    }

    if(entry && entry.isDirectory()){
        var files = await driveObj.promises.readdir(filepath)
        files.sort()
        return res.json({"files": files})
    }else{
        var content = await  driveObj.promises.readFile(filepath, 'utf8');
        return res.send(content)
    }

}))


module.exports = router
