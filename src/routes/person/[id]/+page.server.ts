import type { Actions, PageServerLoad } from '../$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/db/prisma';
import { PRIVATE_AZURE_BLOB_SERVICE_SAS_URL, PRIVATE_IMGIX_PURGE_KEY } from '$env/static/private';
import { BlobServiceClient } from '@azure/storage-blob';

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/login');
	}

	const getPerson = async () => {
		const person = prismaClient.person.findUnique({
			where: { id: Number(params.id) },
			include: {
				riegen: {
					include: {
						riege: true
					}
				},
				avatar: true
			}
		});

		if (!person) {
			throw error(404, 'Not found');
		}
		return person;
	};

	return {
		person: await getPerson()
	};
};

export const actions: Actions = {
	updatePerson: async ({ request, params, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/');
		}

		const formData = Object.fromEntries(await request.formData());

		try {
			try {
				await prismaClient.person.update({
					where: { id: Number(params.id) },
					data: {
						email: (formData.email as string) || '',
						firstName: (formData.firstName as string) || '',
						name: (formData.name as string) || ''
					}
				});
			} catch (err) {
				console.error('Error updating Person:', err);
				return fail(500, { message: 'Failed to update Person' });
			}
		} catch (err) {
			console.error('Error updating fields:', err);
			return fail(500, { message: 'Failed to update fields' });
		}
	},

	updateAvatar: async ({ params, locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/login');
		}

		const formData = Object.fromEntries(await request.formData());

		// Image upload
		const blobSasUrl = PRIVATE_AZURE_BLOB_SERVICE_SAS_URL;
		const blobServiceClient = new BlobServiceClient(blobSasUrl);
		const containerName = 'galery';
		const containerClient = blobServiceClient.getContainerClient(containerName);
		const { avatar } = formData as { avatar: File };

		if (!avatar) {
			return fail(400, { error: 'No file was uploaded.' });
		}

		let blobUrl;
		try {
			const blobName = `avatars/${avatar.name}`.toLowerCase().replace(/\s/g, '');
			const blockBlobClient = containerClient.getBlockBlobClient(blobName);
			const fileBuffer = await new Response(avatar.stream()).arrayBuffer();
			await blockBlobClient.uploadData(fileBuffer);
			blobUrl = `https://tvn-galery.imgix.net/${blobName}`;
		} catch (err) {
			console.log(err.message);
			return fail(500, { error: err.message });
		}

		try {
			// Retrieve the current person with avatar URL
			const person = await prismaClient.person.findUnique({
				where: { id: Number(params.id) },
				include: { avatar: true }
			});

			purgeImage(person.avatar.url);

			if (person && person.avatar && person.avatar.url) {
				// Extract the blob name from the avatar URL
				const blobName = person.avatar.url.replace('https://tvn-galery.imgix.net/', '');

				if (blobName) {
					// Get the blob client for the current avatar
					const blockBlobClient = containerClient.getBlockBlobClient(blobName);

					// Delete the current avatar from the blob storage
					const message = await blockBlobClient.deleteIfExists({ deleteSnapshots: 'include' });
				}
			}
		} catch (err) {
			console.error('Error updating Person:', err);
			return fail(500, { message: 'Failed to update Person' });
		}

		try {
			await prismaClient.person.update({
				where: { id: Number(params.id) },
				data: {
					avatar: {
						update: {
							url: blobUrl
						}
					}
				}
			});
		} catch (err) {
			console.error('Error creating new Person:', err);
			return fail(500, { message: 'Failed to create new Person' });
		}
	},

	deletePerson: async ({ params, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/');
		}

		try {
			await prismaClient.person.delete({
				where: { id: Number(params.id) }
			});
		} catch (err) {
			console.error('Error deleting entry:', err);

			return fail(500, { message: 'Failed to delete entry' });
		}

		throw redirect(302, '/verwaltung/person');
	}
};

function purgeImage(imgixUrl) {
	const API_ENDPOINT = 'https://api.imgix.com/api/v1/purge';

	const headers = {
		Authorization: `Bearer ${PRIVATE_IMGIX_PURGE_KEY}`,
		'Content-Type': 'application/vnd.api+json'
	};

	const payload = {
		data: {
			type: 'purges',
			attributes: {
				url: imgixUrl
			}
		}
	};

	fetch(API_ENDPOINT, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(payload)
	})
		.then((response) => response.json())
		.catch((error) => {
			console.error('Error:', error);
		});
}
