import { prismaClient } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	let role;

	role = await prismaClient.role.findUnique({
		where: { id: Number(params.id) }
	});

	return json({
		role: role
	});
};
