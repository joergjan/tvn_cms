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
    createWeekday: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            await prismaClient.weekday.create({
                data: {
                    name: (formData.weekday as string) || "",
                },
            });
        } catch (e) {
            console.error("Failed to create new Weekday" + e);
            return fail(500, { message: "Failed to create new Weekday" });
        }

        throw redirect(302, "/weekday");
    },
    updateWeekday: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            await prismaClient.weekday.update({
                where: { id: Number(formData.id) },
                data: {
                    name: (formData.role as string) || "",
                },
            });
        } catch (e) {
            console.error("Failed to create new Weekday" + e);
            return fail(500, { message: "Failed to create new Weekday" });
        }

        throw redirect(302, "/weekday");
    },
    deleteWeekday: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            await prismaClient.weekday.delete({
                where: { id: Number(formData.id) },
            });
        } catch (e) {
            console.error("Failed to create new Weekday" + e);
            return fail(500, { message: "Failed to create new Weekday" });
        }

        throw redirect(302, "/weekday");
    },
};
