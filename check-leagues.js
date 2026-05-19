const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const leagues = await prisma.league.findMany({
      select: { id: true, name: true, slug: true },
    });
    console.log('Leagues in database:');
    leagues.forEach((l) => console.log(`  ID: ${l.id}, Name: ${l.name}, Slug: ${l.slug}`));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
})();
