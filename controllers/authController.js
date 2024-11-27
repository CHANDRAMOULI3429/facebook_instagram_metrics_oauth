const axios = require('axios');
const { storeUserProfile } = require('./userProfileController');

// Instagram OAuth: Step 1 - Get Auth URL
exports.getInstagramAuthUrl = (req, res) => {
    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    res.json({ authUrl: instagramAuthUrl });
};

// Instagram OAuth: Step 2 - Exchange Code for Token
exports.exchangeCodeForInstagramToken = async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('Missing authorization code');

    try {
        const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', null, {
            params: {
                client_id: process.env.INSTAGRAM_CLIENT_ID,
                client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
                code,
            },
        });

        const { access_token } = tokenResponse.data;

        const userProfileResponse = await axios.get('https://graph.instagram.com/me', {
            params: { access_token, fields: 'id,username,account_type' },
        });

        await storeUserProfile(userProfileResponse.data, 'instagram');
        res.json({ message: 'Instagram OAuth successful', data: userProfileResponse.data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Instagram OAuth: Step 3 - Get Long-Lived Token
exports.getLongLivedInstagramToken = async (req, res) => {
    const { shortLivedToken } = req.query;
    if (!shortLivedToken) return res.status(400).send('Missing short-lived token');

    try {
        const response = await axios.get('https://graph.instagram.com/access_token', {
            params: {
                grant_type: 'ig_exchange_token',
                client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
                access_token: shortLivedToken,
            },
        });

        res.json({ longLivedToken: response.data.access_token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Instagram OAuth: Step 4 - Refresh Long-Lived Token
exports.refreshInstagramToken = async (req, res) => {
    const { longLivedToken } = req.query;
    if (!longLivedToken) return res.status(400).send('Missing long-lived token');

    try {
        const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
            params: { grant_type: 'ig_refresh_token', access_token: longLivedToken },
        });

        res.json({ refreshedToken: response.data.access_token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Facebook OAuth: Exchange Code for Token
exports.exchangeCodeForFacebookToken = async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('Missing authorization code');

    try {
        const response = await axios.get('https://graph.facebook.com/v12.0/oauth/access_token', {
            params: {
                client_id: process.env.FACEBOOK_CLIENT_ID,
                client_secret: process.env.FACEBOOK_CLIENT_SECRET,
                redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
                code,
            },
        });

        const { access_token } = response.data;
        res.json({ accessToken: access_token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Facebook OAuth: Get Profile
exports.getFacebookProfile = async (req, res) => {
    const { accessToken } = req.query;
    if (!accessToken) return res.status(400).send('Missing access token');

    try {
        const userProfileResponse = await axios.get('https://graph.facebook.com/me', {
            params: { access_token: accessToken, fields: 'id,name,email,picture' },
        });

        await storeUserProfile(userProfileResponse.data, 'facebook');
        res.json({ profile: userProfileResponse.data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
