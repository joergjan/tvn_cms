import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    const session = await locals.auth.validate();

    if (session?.user) {
        return {
            isAdmin: session.user.isAdmin,
            isEditor: session.user.isEditor,
            username: session.user.username,
            name: session.user.name,
        };
    }
};
