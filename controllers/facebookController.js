const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

const saveFacebookMedia = async (req, res) => {
  try {
    const { userId, accessToken } = req.body;

    // Fetch Facebook media
    const mediaResponse = await axios.get(`https://graph.facebook.com/v17.0/${userId}/posts`, {
      params: {
        fields: 'id,message,story,permalink_url,created_time',
        access_token: accessToken,
      },
    });

    const mediaData = mediaResponse.data.data;

    for (const media of mediaData) {
      await prisma.facebookMedia.upsert({
        where: { mediaId: media.id },
        update: {
          caption: media.message || media.story,
          permalink: media.permalink_url,
          timestamp: new Date(media.created_time),
        },
        create: {
          facebookUserId: userId,
          mediaId: media.id,
          caption: media.message || media.story,
          permalink: media.permalink_url,
          timestamp: new Date(media.created_time),
        },
      });
    }

    res.status(200).json({ message: 'Media saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save media.' });
  }
};

module.exports = {
  saveFacebookMedia,
};
