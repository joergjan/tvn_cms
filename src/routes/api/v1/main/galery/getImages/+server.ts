import { prismaClient } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	let imageFolder = [];

	imageFolder = await prismaClient.imageFolder.findMany({
		include: {
			image: true
		}
	});

	imageFolder = imageFolder.map((folder) => {
		// For each folder, remove duplicate images based on the part of the url after the last '/'
		const uniqueImages = Array.from(
			new Set(folder.image.map((image) => image.url.split('/').pop()))
		).map((urlPart) => {
			return folder.image.find((image) => image.url.includes(urlPart));
		});

		// Return a new object with the unique images
		return { ...folder, image: uniqueImages };
	});

	return json({
		imageFolder: imageFolder
	});
};
