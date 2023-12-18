var express = require('express');
var router = express.Router();
const PetControl = require('../controller/PetControl');

/* Make routes for pages */
router.get('/', PetControl.index);
router.get('/manage', PetControl.manage);

module.exports = router;
