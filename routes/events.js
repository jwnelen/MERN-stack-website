var express = require('express');
var router = express.Router();

var events_controller = require('../controllers/eventsController');

router.get('/', events_controller.index);

router.get('/:id', events_controller.events_detail);

router.post('/:id', events_controller.event_register_post);

module.exports = router;