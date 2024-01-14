import { prismaClient } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({}) => {
	let riegen = [];

	riegen = await prismaClient.riege.findMany({
		include: {
			image: true
		}
	});

	return json({
		riegen: riegen
	});
};
