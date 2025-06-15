const express = require('express');
const router = express.Router();
const codeforcesController =  require('../controllers/codeforcesController');

router.get('/user/:handle', codeforcesController.getCodeForcesData);

module.exports = router;