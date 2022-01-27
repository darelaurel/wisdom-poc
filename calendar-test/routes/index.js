var express = require('express');
var router = express.Router();
const zoomApi = require('./zoomApi')
const calendarApi = require('./calendarApi')

router.use("api/zoom", zoomApi)

router.use('/calendar', calendarApi)

module.exports = router;
