const express = require('express');
const {
    getInstagramAuthUrl,
    exchangeCodeForInstagramToken,
    getLongLivedInstagramToken,
    refreshInstagramToken,
    exchangeCodeForFacebookToken,
    getFacebookProfile,
} = require('../controllers/authController');

const router = express.Router();

// Instagram Routes
router.get('/instagram/auth-url', getInstagramAuthUrl);
router.get('/instagram/callback', exchangeCodeForInstagramToken);
router.get('/instagram/long-lived-token', getLongLivedInstagramToken);
router.get('/instagram/refresh-token', refreshInstagramToken);

// Facebook Routes
router.get('/facebook/callback', exchangeCodeForFacebookToken);
router.get('/facebook/profile', getFacebookProfile);

module.exports = router;
