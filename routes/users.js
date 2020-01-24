var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');

// Login Page GET
router.get('/profile', user_controller.profile_get);

router.post('/profile', user_controller.profile_post);

module.exports = router;
