import { auth } from "$lib/server/db/lucia";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth.validate();
    if (session) {
        throw redirect(302, "/");
    }
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const { username, password } = Object.fromEntries(
            await request.formData()
        ) as Record<string, string>;

        try {
            const key = await auth.useKey("username", username, password);
            const session = await auth.createSession({
                userId: key.userId,
                attributes: {}, // expects `Lucia.DatabaseSessionAttributes`
            });
            locals.auth.setSession(session);
        } catch (err) {
            console.error(err);
            throw redirect(302, "https://www.tvnussbaumen.ch");
        }
        throw redirect(302, "/");
    },
};
