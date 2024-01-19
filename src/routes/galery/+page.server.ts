import type { Actions, PageServerLoad } from "../$types";
import { fail, redirect } from "@sveltejs/kit";
import { prismaClient } from "$lib/server/db/prisma";
import { PRIVATE_API_KEY, BLOB_READ_WRITE_TOKEN } from "$env/static/private";
import { put, del } from "@vercel/blob";

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
        const folderId = Number(formData.folderId);

        const uploadPromises = images.map(async (image) => {
            if (!(image instanceof File)) {
                return fail(400, { error: "Invalid file data." });
            }

            let blobUrl;
            try {
                const blobName = `galery/${image.name}`
                    .toLowerCase()
                    .replace(/\s/g, "");

                const { url } = await put(blobName, image, {
                    access: "public",
                    token: BLOB_READ_WRITE_TOKEN,
                });

                blobUrl = url;
            } catch (err) {
                console.log("Error uploading images to blob", err.message);
                return fail(500, { error: err.message });
            }

            try {
                const existingImage = await prismaClient.image.findFirst({
                    where: {
                        url: blobUrl,
                    },
                });
                if (!existingImage) {
                    await prismaClient.image.create({
                        data: {
                            url: blobUrl,
                            galeryId: folderId,
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
    createGalery: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            await prismaClient.galery.create({
                data: {
                    name: (formData.galery as string) || "",
                },
            });
        } catch (e) {
            console.error("Failed to create new galery" + e);
            return fail(500, { message: "Failed to create new galery" });
        }

        throw redirect(302, "/galery");
    },
    updateGalery: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            await prismaClient.galery.update({
                where: { id: Number(formData.id) },
                data: {
                    name: (formData.galery as string) || "",
                },
            });
        } catch (e) {
            console.error("Failed to create new galery" + e);
            return fail(500, { message: "Failed to create new galery" });
        }

        throw redirect(302, "/galery");
    },
    deleteGalery: async ({ request, locals }) => {
        const session = await locals.auth.validate();

        if (session?.user?.isAdmin) {
            const formData = Object.fromEntries(await request.formData());

            try {
                await prismaClient.galery.delete({
                    where: { id: Number(formData.id) },
                });
            } catch (e) {
                console.error("Failed to delete galery" + e);
                return fail(500, { message: "Failed to delete galery" });
            }

            throw redirect(302, "/galery");
        }
        throw redirect(302, "https://www.tvnussbaumen.ch");
    },
    deleteImage: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/");
        }

        const formData = Object.fromEntries(await request.formData());
        const url = formData.url as string;

        try {
            await del(url, { token: BLOB_READ_WRITE_TOKEN });
        } catch (e) {
            console.error("Failed to delezte image" + e);
            return fail(500, { message: "Failed to delete image" });
        }

        try {
            await prismaClient.image.delete({
                where: { id: Number(formData.id) },
            });
        } catch (e) {
            console.error("Failed to delezte image" + e);
            return fail(500, { message: "Failed to delete image" });
        }
    },
};
