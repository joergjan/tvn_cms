import { prismaClient } from "$lib/server/db/prisma";
import { PRIVATE_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import cookie from "cookie";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    const session = cookies.auth_session;

    if (!session && request.headers.get("TVN-API-KEY") !== PRIVATE_API_KEY) {
        return json({
            error: "Unauthorized",
        });
    }

    let personen = [];

    personen = await prismaClient.person.findMany({
        include: {
            avatar: true,
        },
    });

    return json({
        personen: personen,
    });
}
