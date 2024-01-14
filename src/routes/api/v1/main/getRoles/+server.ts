import { prismaClient } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({}) => {
	let roles = [];

	roles = await prismaClient.role.findMany({});

	return json({
		roles: roles
	});
};
