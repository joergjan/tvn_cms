import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';

const prismaClient = global.__prisma || new PrismaClient({});

if (env.NODE_ENV === 'development') {
	global.__prisma = prismaClient;
}

export { prismaClient };
