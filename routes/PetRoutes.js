var express = require('express');
var router = express.Router();
const PetControl = require('../controller/PetControl');
const multer = require('multer'); // File processor (requires enctype="multipart/form-data" in form)
// Set up multer to be used in routes
function filter(req, file, cb){
  if (file.mimetype=='image/png' || file.mimetype=='image/jpeg'){
    cb(null, true);
  } else {
    console.log(file.mimetype);
    req.issue = 'BAD FILE TYPE. Only .png or .jpeg allowed.'
    cb(null, false);
  }
}
// Filesize limit set to 2mb, bigger images cause error that's handled in app.js error handler.
const upload = multer({dest: 'upload', limits: {fileSize: 2 * 1024 * 1024}, fileFilter: filter}); 

/* Make routes for pages */
router.get('/', PetControl.index);
router.get('/manage', PetControl.manage);
router.get('/create', PetControl.create);
router.post('/store', upload.single('foto'), PetControl.store); 
router.get('/vote/:id', PetControl.vote);

module.exports = router;
