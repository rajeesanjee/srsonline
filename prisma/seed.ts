import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name =
    process.env.ADMIN_NAME ?? "Rajalakshmi Stores Admin";

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env."
    );
  }

  const hashedPassword = await hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin account ready: ${admin.email}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });