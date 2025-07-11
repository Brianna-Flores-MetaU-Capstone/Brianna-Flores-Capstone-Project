const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const checkUserExists = async (firebaseId: string) => {
  const user = await prisma.User.findUnique({
    where: { firebaseId: firebaseId },
  });
  return user;
};

export { checkUserExists };
