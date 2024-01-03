const express = require ('express');
const StatControl = require('../controller/StatControl');
const router = express.Router();

router.get('/stats', StatControl.stats);

module.exports = router;