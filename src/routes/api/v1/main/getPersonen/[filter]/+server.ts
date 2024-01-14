import { prismaClient } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	let personen = [];

	personen = await prismaClient.person.findMany({
		where: {
			OR: [
				{
					riegen: {
						some: {
							riege: {
								name: {
									contains: params.filter
								}
							}
						}
					}
				},
				{
					firstName: {
						contains: params.filter
					}
				},
				{
					name: {
						contains: params.filter
					}
				}
			]
		},
		include: {
			avatar: true,
			riegen: {
				include: {
					riege: true
				}
			}
		}
	});

	return json({
		personen: personen
	});
};
