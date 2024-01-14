import { prismaClient } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	let folderNames = [];

	folderNames = await prismaClient.imageFolder.findMany({
		where: { id: Number(params.id) },
		cacheStrategy: { ttl: 60 }
	});

	return json({
		folderNames: folderNames
	});
};
