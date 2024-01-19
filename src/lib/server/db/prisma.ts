import { PrismaClient } from "@prisma/client";
import { env } from "$env/dynamic/private";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClient =
    global.__prisma || new PrismaClient({}).$extends(withAccelerate());

if (env.NODE_ENV === "development") {
    global.__prisma = prismaClient;
}

export { prismaClient };
