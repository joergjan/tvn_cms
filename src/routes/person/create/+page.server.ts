import type { Actions, PageServerLoad } from '../$types';
import { fail, redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/db/prisma';
import { PRIVATE_AZURE_BLOB_SERVICE_SAS_URL } from '$env/static/private';
import { BlobServiceClient } from '@azure/storage-blob';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/login');
	}
};

export const actions: Actions = {
	createPerson: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/');
		}

		const formData = Object.fromEntries(await request.formData());

		// Image upload
		const blobSasUrl = PRIVATE_AZURE_BLOB_SERVICE_SAS_URL;
		const blobServiceClient = new BlobServiceClient(blobSasUrl);
		const containerName = 'galery';
		const containerClient = blobServiceClient.getContainerClient(containerName);
		const { image } = formData as { image: File };

		if (!image) {
			return fail(400, { error: 'No file was uploaded.' });
		}

		let blobUrl;
		try {
			const blobName = `avatars/${image.name}`.toLowerCase().replace(/\s/g, '');
			const blockBlobClient = containerClient.getBlockBlobClient(blobName);
			const fileBuffer = await new Response(image.stream()).arrayBuffer();
			await blockBlobClient.uploadData(fileBuffer);
			blobUrl = `https://tvn-galery.imgix.net/${blobName}`;
		} catch (err) {
			console.log(err.message);
			return fail(500, { error: err.message });
		}

		try {
			await prismaClient.person.create({
				data: {
					firstName: (formData.firstName as string) || '',
					name: (formData.name as string) || '',
					isVorstand: formData.isVorstand === 'true' || false,
					email: (formData.email as string) || '',
					roleId: Number(formData.role) || 0,
					avatar: {
						create: {
							url: blobUrl
						}
					}
				}
			});
		} catch (err) {
			console.error('Error creating new Person:', err);
			return fail(500, { message: 'Failed to create new Person' });
		}

		throw redirect(302, '/verwaltung');
	}
};
