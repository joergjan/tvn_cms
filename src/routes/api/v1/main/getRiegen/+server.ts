import { prismaClient } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({}) => {
	let riegen = [];

	riegen = await prismaClient.riege.findMany({
		include: {
			trainingszeiten: {
				include: {
					weekday: true
				}
			},
			person: {
				include: {
					person: {
						include: {
							avatar: true
						}
					}
				}
			},
			image: {
				take: 3,
				orderBy: {
					date: 'desc'
				}
			}
		}
	});

	return json({
		riegen: riegen
	});
};
