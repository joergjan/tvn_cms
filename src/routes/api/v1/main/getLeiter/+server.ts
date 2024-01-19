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
        let leiter = [];

        leiter = await prismaClient.person.findMany({
            where: {
                riegen: {
                    some: {},
                },
            },
            include: {
                image: true,
                riegen: {
                    include: {
                        riege: {
                            include: {
                                image: true,
                                trainingszeiten: {
                                    include: {
                                        weekday: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return json({
            leiter: leiter,
        });
    } else {
        return json({
            status: 401,
            message: "UNAUTHORIZED REQUEST",
        });
    }
}
