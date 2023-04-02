const express = require('express');
const router = express.Router();

const AuthController = require('../controllers//AuthController');



// [ Auth ] /v1/auth
router.post('/register', AuthController.register);


module.exports = router;