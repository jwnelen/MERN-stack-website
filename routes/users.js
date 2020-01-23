var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');

// Login Page GET
router.get('/login', user_controller.login_get);

// Login Page POST
router.post('/login', user_controller.login_post);

// Register Page GET
router.get('/register', user_controller.register_get);

// Register Page POST
router.post('/register', user_controller.register_post);

module.exports = router;
