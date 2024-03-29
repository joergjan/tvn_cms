import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "../$types";
import { prismaClient } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw redirect(302, "/login");
    }
};

export const actions: Actions = {
    createRole: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            await prismaClient.role.create({
                data: {
                    name: (formData.role as string) || "",
                },
            });
        } catch (e) {
            console.error("Failed to create new Role" + e);
            return fail(500, { message: "Failed to create new Role" });
        }

        throw redirect(302, "/role");
    },
    updateRole: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            await prismaClient.role.update({
                where: { id: Number(formData.id) },
                data: {
                    name: (formData.role as string) || "",
                },
            });
        } catch (e) {
            console.error("Failed to create new Role" + e);
            return fail(500, { message: "Failed to create new Role" });
        }

        throw redirect(302, "/role");
    },
    deleteRole: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            await prismaClient.role.delete({
                where: { id: Number(formData.id) },
            });
        } catch (e) {
            console.error("Failed to create new Role" + e);
            return fail(500, { message: "Failed to create new Role" });
        }

        throw redirect(302, "/role");
    },
};
