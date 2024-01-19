import { prismaClient } from "$lib/server/db/prisma";
import { PRIVATE_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import cookie from "cookie";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals }) {
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    const session = await locals.auth.validate();

    if (
        (session && session.sessionId === cookies.auth_session) ||
        request.headers.get("TVN-API-KEY") === PRIVATE_API_KEY
    ) {
        let riegen = [];

        riegen = await prismaClient.riege.findMany({
            include: {
                trainingszeiten: {
                    include: {
                        weekday: true,
                    },
                },
                person: {
                    include: {
                        person: {
                            include: {
                                image: true,
                            },
                        },
                    },
                },
                image: {
                    take: 3,
                },
            },
        });

        return json({
            riegen: riegen,
        });
    } else {
        return json({
            status: 401,
            message: "UNAUTHORIZED REQUEST",
        });
    }
}
