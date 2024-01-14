import { prismaClient } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	let personen = [];

	personen = await prismaClient.person.findMany({
		include: {
			avatar: true
		}
	});

	return json({
		personen: personen
	});
};
