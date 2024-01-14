import { prismaClient } from "$lib/server/db/prisma";
import { json } from "@sveltejs/kit";
import { PRIVATE_API_KEY } from "$env/static/private";
import cookie from "cookie";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals }) {
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    const session = await locals.auth.validate();

    if (
        (session && session.sessionId === cookies.auth_session) ||
        request.headers.get("TVN-API-KEY") === PRIVATE_API_KEY
    ) {
        let imageFolder = [];

        imageFolder = await prismaClient.imageFolder.findMany({
            include: {
                image: true,
            },
        });

        imageFolder = imageFolder.map((folder) => {
            // For each folder, remove duplicate images based on the part of the url after the last '/'
            const uniqueImages = Array.from(
                new Set(folder.image.map((image) => image.url.split("/").pop()))
            ).map((urlPart) => {
                return folder.image.find((image) =>
                    image.url.includes(urlPart)
                );
            });

            // Return a new object with the unique images
            return { ...folder, image: uniqueImages };
        });

        return json({
            imageFolder: imageFolder,
        });
    } else {
        return json({
            status: 401,
            message: "UNAUTHORIZED REQUEST",
        });
    }
}
