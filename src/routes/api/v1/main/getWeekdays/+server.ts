import { prismaClient } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	let weekdays = [];

	weekdays = await prismaClient.weekday.findMany({});

	return json({
		weekdays: weekdays
	});
};
