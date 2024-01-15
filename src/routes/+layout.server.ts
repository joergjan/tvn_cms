import type { LayoutServerLoad } from "./$types";
import { auth } from "$lib/server/db/lucia";

export const load: LayoutServerLoad = async ({ locals }) => {
    const session = await locals.auth.validate();

    if (session && session.user) {
        return {
            userId: session.user.userId,
            username: session.user.username,
            name: session.user.name,
        };
    }
};
