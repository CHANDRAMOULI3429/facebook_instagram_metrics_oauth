const axios = require('axios');

const fetchInstagramMedia = async (userId, accessToken) => {
  const response = await axios.get(`https://graph.instagram.com/v17.0/${userId}/media`, {
    params: {
      fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,permalink',
      access_token: accessToken,
    },
  });
  return response.data.data;
};

const fetchFacebookMedia = async (userId, accessToken) => {
  const response = await axios.get(`https://graph.facebook.com/v17.0/${userId}/posts`, {
    params: {
      fields: 'id,message,story,permalink_url,created_time',
      access_token: accessToken,
    },
  });
  return response.data.data;
};

module.exports = {
  fetchInstagramMedia,
  fetchFacebookMedia,
};
