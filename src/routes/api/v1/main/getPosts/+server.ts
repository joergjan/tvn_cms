import { prismaClient } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	let posts = [];

	posts = await prismaClient.post.findMany({
		include: {
			image: true
		}
	});

	return json({
		posts: posts
	});
};
