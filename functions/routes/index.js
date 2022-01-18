var express = require('express');
const zoomApiRoutes = require('./zoomApi')
var router = express.Router();

router.use("/zoom", zoomApiRoutes);

module.exports = router;
