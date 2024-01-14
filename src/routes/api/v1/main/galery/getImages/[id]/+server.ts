import { prismaClient } from "$lib/server/db/prisma";
import { json } from "@sveltejs/kit";
import { PRIVATE_API_KEY } from "$env/static/private";
import cookie from "cookie";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals }) {
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    const session = await locals.auth.validate();

    if (
        cookies.auth_session != session.sessionId &&
        request.headers.get("TVN-API-KEY") !== PRIVATE_API_KEY
    ) {
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
