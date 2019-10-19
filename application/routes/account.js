/* This file handles "/account" route */

const express = require('express');
const router = express.Router();

// Render dashboard page
router.get('/', (req, res) => {
    res.render('dashboard');
});

module.exports = router;