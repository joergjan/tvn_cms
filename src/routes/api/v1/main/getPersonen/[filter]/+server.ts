import { prismaClient } from "$lib/server/db/prisma";
import { PRIVATE_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import cookie from "cookie";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals, params }) {
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    const session = await locals.auth.validate();

    if (
        (session && session.sessionId === cookies.auth_session) ||
        request.headers.get("TVN-API-KEY") === PRIVATE_API_KEY
    ) {
        let personen = [];

        personen = await prismaClient.person.findMany({
            where: {
                OR: [
                    {
                        riegen: {
                            some: {
                                riege: {
                                    name: {
                                        contains: params.filter,
                                    },
                                },
                            },
                        },
                    },
                    {
                        firstName: {
                            contains: params.filter,
                        },
                    },
                    {
                        name: {
                            contains: params.filter,
                        },
                    },
                ],
            },
            include: {
                avatar: true,
                riegen: {
                    include: {
                        riege: true,
                    },
                },
            },
        });

        return json({
            personen: personen,
        });
    } else {
        return json({
            status: 401,
            message: "UNAUTHORIZED REQUEST",
        });
    }
}
