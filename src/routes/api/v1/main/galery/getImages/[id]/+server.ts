import { prismaClient } from "$lib/server/db/prisma";
import { json } from "@sveltejs/kit";
import { PRIVATE_API_KEY } from "$env/static/private";
import cookie from "cookie";
import { withAccelerate } from "@prisma/extension-accelerate";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals, params }) {
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    const session = await locals.auth.validate();

    if (
        (session && session.sessionId === cookies.auth_session) ||
        request.headers.get("TVN-API-KEY") === PRIVATE_API_KEY
    ) {
        let galery;

        galery = await prismaClient
            .$extends(withAccelerate())
            .galery.findUnique({
                where: { id: Number(params.id) },
                include: {
                    image: true,
                },
                cacheStrategy: {
                    ttl: 60,
                },
            });

        return json({
            galery: galery,
        });
    } else {
        return json({
            status: 401,
            message: "UNAUTHORIZED REQUEST",
        });
    }
}
