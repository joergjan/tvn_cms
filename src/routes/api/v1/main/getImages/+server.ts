import { prismaClient } from "$lib/server/db/prisma";
import { PRIVATE_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import cookie from "cookie";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    const user = cookies.user;

    if (!user && request.headers.get("TVN-API-KEY") !== PRIVATE_API_KEY) {
        return json({
            error: "Unauthorized",
        });
    }

    let riegen = [];

    riegen = await prismaClient.riege.findMany({
        include: {
            image: true,
        },
    });

    return json({
        riegen: riegen,
    });
}
