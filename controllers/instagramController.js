const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

const saveInstagramMedia = async (req, res) => {
  try {
    const { userId, accessToken } = req.body;

    // Fetch Instagram media
    const mediaResponse = await axios.get(`https://graph.instagram.com/v17.0/${userId}/media`, {
      params: {
        fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,permalink',
        access_token: accessToken,
      },
    });

    const mediaData = mediaResponse.data.data;

    for (const media of mediaData) {
      await prisma.instagramMedia.upsert({
        where: { mediaId: media.id },
        update: {
          mediaType: media.media_type,
          mediaUrl: media.media_url,
          thumbnailUrl: media.thumbnail_url,
          caption: media.caption,
          permalink: media.permalink,
          timestamp: new Date(media.timestamp),
        },
        create: {
          instagramUserId: userId,
          mediaId: media.id,
          mediaType: media.media_type,
          mediaUrl: media.media_url,
          thumbnailUrl: media.thumbnail_url,
          caption: media.caption,
          permalink: media.permalink,
          timestamp: new Date(media.timestamp),
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
  saveInstagramMedia,
};
