const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Store or update user profile in the database.
 * @param {Object} userData - The user profile data from Facebook or Instagram.
 * @param {string} platform - The platform ('facebook' or 'instagram').
 */
exports.storeUserProfile = async (userData, platform) => {
    const { id, username, name, email, account_type } = userData;

    try {
        // Check the platform and handle the user data accordingly
        if (platform === 'facebook') {
            await prisma.userProfile.upsert({
                where: { platformId: id },
                update: { name, email },
                create: {
                    platformId: id,
                    name,
                    email,
                    platform: 'facebook',
                },
            });
        } else if (platform === 'instagram') {
            await prisma.userProfile.upsert({
                where: { platformId: id },
                update: { username, accountType: account_type },
                create: {
                    platformId: id,
                    username,
                    accountType: account_type,
                    platform: 'instagram',
                },
            });
        }
    } catch (error) {
        console.error('Error storing user profile:', error.message);
        throw error;
    }
};

/**
 * Retrieve user profile from the database.
 * @param {string} platformId - The unique ID of the user in the platform.
 * @returns {Object|null} - The user profile if found, or null.
 */
exports.getUserProfile = async (platformId) => {
    try {
        const userProfile = await prisma.userProfile.findUnique({
            where: { platformId },
        });

        return userProfile;
    } catch (error) {
        console.error('Error retrieving user profile:', error.message);
        throw error;
    }
};

/**
 * Close Prisma connection on process exit.
 */
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('Prisma disconnected gracefully.');
    process.exit(0);
});
