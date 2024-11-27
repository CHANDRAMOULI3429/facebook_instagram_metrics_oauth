const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Fetch Instagram Metrics for a User
 * @param {string} userId - The platformId of the Instagram user
 * @returns {Array} - Array of Instagram media data
 */
exports.fetchInstagramData = async (req, res) => {
    const { userId, accessToken } = req.query;

    try {
        // Validate user in the database
        let user = await prisma.userProfile.findUnique({ where: { platformId: userId } });

        if (!user && !accessToken) {
            return res.status(400).json({ error: 'User not found or accessToken is required' });
        }

        const token = accessToken || user.accessToken;

        // Fetch Instagram profile
        const profileResponse = await axios.get('https://graph.instagram.com/me', {
            params: { fields: 'id,username', access_token: token },
        });

        const profile = profileResponse.data;

        // Fetch Instagram media
        const mediaResponse = await axios.get('https://graph.instagram.com/me/media', {
            params: { fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp', access_token: token },
        });

        const mediaData = mediaResponse.data.data;

        // Save media data to the database
        await prisma.instagramMedia.createMany({
            data: mediaData.map((media) => ({
                instagramUserId: profile.id,
                mediaId: media.id,
                mediaType: media.media_type,
                mediaUrl: media.media_url,
                thumbnailUrl: media.thumbnail_url || null,
                caption: media.caption || '',
                timestamp: new Date(media.timestamp),
            })),
            skipDuplicates: true,
        });

        res.json({ profile, media: mediaData });
    } catch (error) {
        console.error('Error fetching Instagram data:', error.message);
        res.status(500).json({ error: 'Failed to fetch Instagram data' });
    }
};


/**
 * Fetch Metrics Debugging
 * This function can be used to debug Prisma database connection and queries
 */
exports.debugPrismaConnection = async () => {
    try {
        const metrics = await prisma.instagramMedia.findMany();
        console.log('Fetched metrics from the database:', metrics);
        return metrics;
    } catch (error) {
        console.error('Error in Prisma query:', error.message);
        throw error;
    }
};

/**
 * Close Prisma Connection
 * Clean up Prisma connection to avoid memory leaks
 */
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('Prisma disconnected gracefully.');
    process.exit(0);
});
