var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler')

var drive = require('../../drive.js')

// LIST WIKIS in a DRIVE
router.get('/drive/:id/wikis', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = "/"
    var entry = null
    console.log(filepath)
    try {
        entry = await driveObj.promises.stat(filepath)
       
        var files = await driveObj.promises.readdir(filepath)
        files.sort()
        wikis = []

        files.map( function(file) {
            if(file.startsWith("info_")){
                wikis.push({"name": file, "url": `/drive/${req.params.id}/wikis/${file}`})
            }
        })
        console.log(wikis)
        res.render('wikis/wikis.mustache', {wikis : wikis});
    } catch (e) {
        console.log(e)
        return res.status(404).json('');
    }
}))

// WIKI index page
router.get('/drive/:id/wikis/:wikiname', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = `/${req.params.wikiname}/index.html`
    var entry = null
    try {
        entry = await driveObj.promises.stat(filepath)
        var content = await  driveObj.promises.readFile(filepath, 'utf8');
        return res.send(content)
       
    } catch (e) {
        console.log(e)
        return res.status(404).json('');
    }
}))

// FILE
router.get('/drive/:id/wikis/:wikiname/:filename', asyncHandler(async (req, res) => {
    var driveObj = await drive.get(req.params.id)
    var filepath = `/${req.params.wikiname}/${req.params.filename}`
    var entry = null
    try {
        entry = await driveObj.promises.stat(filepath)
        var content = await  driveObj.promises.readFile(filepath, 'utf8');
        return res.send(content)
       
    } catch (e) {
        console.log(e)
        if (req.params.filename == "README.md"){
            filepath = `/${req.params.wikiname}/readme.md`
            try{
                entry = await driveObj.promises.stat(filepath)
                var content = await  driveObj.promises.readFile(filepath, 'utf8');
                return res.send(content)
            }catch(e){
                var content =`# ${req.params.wikiname}`
                return res.send(content)
            }            
        }
        return res.status(404).json('');
    }
}))


module.exports = router


