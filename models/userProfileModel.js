const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const saveUserProfile = async (userId, profile) => {
  await prisma.userProfile.upsert({
    where: { userId },
    update: profile,
    create: { userId, ...profile },
  });
};

module.exports = {
  saveUserProfile,
};
