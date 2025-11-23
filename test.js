const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const all = await prisma.url.findMany();
  console.log("urls:", all);
}

main()
  .catch(e => {
    console.error("Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
