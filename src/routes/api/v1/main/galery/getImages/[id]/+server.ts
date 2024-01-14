import { prismaClient } from "$lib/server/db/prisma";
import { json } from "@sveltejs/kit";
import { PRIVATE_API_KEY } from "$env/static/private";
import cookie from "cookie";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, params }) {
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    const user = cookies.user;

    if (!user && request.headers.get("TVN-API-KEY") !== PRIVATE_API_KEY) {
        return json({
            error: "Unauthorized",
        });
    }
    let folderNames = [];

    folderNames = await prismaClient.imageFolder.findMany({
        where: { id: Number(params.id) },
    });

    return json({
        folderNames: folderNames,
    });
}
