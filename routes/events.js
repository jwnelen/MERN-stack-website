var express = require('express');
var router = express.Router();

var events_controller = require('../controllers/eventsController');

router.get('/', events_controller.index);

module.exports = router;