const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const saveInstagramMediaInsights = async (mediaId, insights) => {
  await prisma.instagramMediaInsights.upsert({
    where: { mediaId },
    update: insights,
    create: { mediaId, ...insights },
  });
};

const saveFacebookMediaInsights = async (mediaId, insights) => {
  await prisma.facebookMediaInsights.upsert({
    where: { mediaId },
    update: insights,
    create: { mediaId, ...insights },
  });
};

module.exports = {
  saveInstagramMediaInsights,
  saveFacebookMediaInsights,
};
