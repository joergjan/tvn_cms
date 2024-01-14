import type { Actions, PageServerLoad } from '../$types';
import { fail, redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/db/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/login');
	}
};

export const actions: Actions = {
	createRiege: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/');
		}

		const formData = Object.fromEntries(await request.formData());

		let newRiege: tvn.Riege;

		let leiter = [];
		for (let i = 0; i <= 3; i++) {
			if (formData[`personId${i}`]) {
				leiter.push(Number(formData[`personId${i}`]));
			}
		}

		try {
			try {
				newRiege = await prismaClient.riege.create({
					data: {
						name: (formData.name as string) || '',
						description: (formData.description as string) || '',
						age: (formData.age as string) || ''
					}
				});
			} catch (e) {
				console.error('Failed to create new Riege' + e);
				return fail(500, { message: 'Failed to create new Riege' });
			}
			console.log(newRiege);

			try {
				leiter.forEach((leiterItem) => {
					let addedLeiter;

					// Define the async function and immediately invoke it
					(async () => {
						addedLeiter = await prismaClient.riege.update({
							where: { id: Number(newRiege.id) },
							data: {
								person: {
									connectOrCreate: {
										where: {
											personId_riegeId: {
												personId: leiterItem,
												riegeId: Number(newRiege.id) // replace 1 with the actual riegeId
											}
										},
										create: {
											personId: leiterItem
										}
									}
								}
							}
						});
						console.log(addedLeiter);
					})();
				});
			} catch (e) {
				console.error('Failed to update Leiter ' + e);
				return fail(500, { message: 'Failed to update Leiter' });
			}

			try {
				await prismaClient.trainingszeit.create({
					data: {
						riege: {
							connect: {
								id: newRiege.id
							}
						},
						weekday: {
							connect: {
								id: parseInt(formData.weekday as string) // replace with actual weekdayId
							}
						},
						from: new Date(`1970-01-01T${formData.from}:00Z`),
						to: new Date(`1970-01-01T${formData.to}:00Z`)
					}
				});
			} catch (e) {
				console.error('Failed to create Trainingszeit ' + e);
				return fail(500, { message: 'Failed to create Trainingszeit' });
			}

			if (formData.from2 && formData.to2 && formData.weekdayId2) {
				try {
					await prismaClient.trainingszeit.create({
						data: {
							riege: {
								connect: {
									id: newRiege.id
								}
							},
							weekday: {
								connect: {
									id: parseInt(formData.weekdayId2 as string)
								}
							},
							from: new Date(`1970-01-01T${formData.from2}:00Z`),
							to: new Date(`1970-01-01T${formData.to2}:00Z`)
						}
					});
				} catch (e) {
					console.error('Failed to create Trainingszeit2 ' + e);
					return fail(500, { message: 'Failed to create Trainingszeit2' });
				}
			}
		} catch (err) {
			console.error('Error creating new Riege:', err);
			return fail(500, { message: 'Failed to create new Riege' });
		}

		throw redirect(302, '/verwaltung');
	}
};
