const express = require('express');

const {
  getPublicHomeContent,
} = require('../controllers/site-content.controller');

const router = express.Router();

router.get('/home', getPublicHomeContent);

module.exports = router;