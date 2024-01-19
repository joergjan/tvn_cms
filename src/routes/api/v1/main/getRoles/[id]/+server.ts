import { prismaClient } from "$lib/server/db/prisma";
import { PRIVATE_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import cookie from "cookie";
import { withAccelerate } from "@prisma/extension-accelerate";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, request, locals }) {
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    const session = await locals.auth.validate();

    if (
        (session && session.sessionId === cookies.auth_session) ||
        request.headers.get("TVN-API-KEY") === PRIVATE_API_KEY
    ) {
        let role;

        role = await prismaClient.$extends(withAccelerate()).role.findUnique({
            where: { id: Number(params.id) },
            cacheStrategy: {
                ttl: 10800,
            },
        });

        return json({
            role: role,
        });
    } else {
        return json({
            status: 401,
            message: "UNAUTHORIZED REQUEST",
        });
    }
}
