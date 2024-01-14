import type { Actions, PageServerLoad } from "../$types";
import { fail, redirect } from "@sveltejs/kit";
import { prismaClient } from "$lib/server/db/prisma";
import {
    PRIVATE_AZURE_BLOB_SERVICE_SAS_URL,
    PRIVATE_API_KEY,
} from "$env/static/private";
import { BlobServiceClient } from "@azure/storage-blob";

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw redirect(302, "/login");
    }

    const folderNames = await fetch("/api/v1/main/galery/getFolderNames", {
        headers: {
            "TVN-API-KEY": PRIVATE_API_KEY,
        },
    });

    return {
        folderNames: await folderNames.json(),
    };
};

export const actions: Actions = {
    uploadImages: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/login");
        }

        const data = await request.formData();
        const formData = Object.fromEntries(data);
        const images = data.getAll("images") as File[];

        // Image upload
        const blobSasUrl = PRIVATE_AZURE_BLOB_SERVICE_SAS_URL;
        const blobServiceClient = new BlobServiceClient(blobSasUrl);
        const containerName = "galery";
        const containerClient =
            blobServiceClient.getContainerClient(containerName);

        const folderId = Number(formData.folderId);
        const riegeId = Number(formData.riegeId);
        let riege;

        try {
            riege = await prismaClient.riege.findUnique({
                where: { id: riegeId },
            });
        } catch (err) {
            console.log("Error finding riege", err.message);
            return fail(500, { error: err.message });
        }

        const uploadPromises = images.map(async (image) => {
            if (!(image instanceof File)) {
                return fail(400, { error: "Invalid file data." });
            }

            let blobUrl;
            try {
                const blobName = `${riege.name}/${image.name}`
                    .toLowerCase()
                    .replace(/\s/g, "");
                const blockBlobClient =
                    containerClient.getBlockBlobClient(blobName);
                const fileBuffer = await new Response(
                    image.stream()
                ).arrayBuffer();
                await blockBlobClient.uploadData(fileBuffer);
                blobUrl = `https://tvn-galery.imgix.net/${blobName}`;
            } catch (err) {
                console.log("Error uploading images to blob", err.message);
                return fail(500, { error: err.message });
            }

            try {
                const existingImage = await prismaClient.image.findFirst({
                    where: {
                        url: blobUrl,
                        riegeId: riegeId,
                    },
                });
                if (!existingImage) {
                    await prismaClient.image.create({
                        data: {
                            url: blobUrl,
                            riegeId: riegeId,
                            imageFolderId: folderId,
                        },
                    });
                }
            } catch (err) {
                console.log("Error saving image in db:", err.message);
                return fail(500, { error: err.message });
            }
        });

        await Promise.all(uploadPromises);
    },
};
