import type { Actions, PageServerLoad } from "../$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { prismaClient } from "$lib/server/db/prisma";
import { PRIVATE_AZURE_BLOB_SERVICE_SAS_URL } from "$env/static/private";
import { BlobServiceClient } from "@azure/storage-blob";

export const load: PageServerLoad = async ({ params, locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw redirect(302, "/login");
    }

    const getRiege = async () => {
        const riege = await prismaClient.riege.findUnique({
            where: { id: Number(params.id) },
            include: {
                person: {
                    include: {
                        person: {
                            include: {
                                image: true,
                            },
                        },
                    },
                },
                trainingszeiten: {
                    include: {
                        weekday: true,
                    },
                },
                image: true,
            },
        });

        if (!riege) {
            throw error(404, "Not found");
        }
        return riege;
    };

    return {
        riege: await getRiege(),
    };
};

export const actions: Actions = {
    updateRiege: async ({ request, params, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/");
        }

        const formData = Object.fromEntries(await request.formData());

        let leiter = [];
        for (let i = 0; i <= 3; i++) {
            if (formData[`personId${i}`]) {
                leiter.push(Number(formData[`personId${i}`]));
            }
        }

        const personRiegeRecords = await prismaClient.personRiege.findMany({
            where: { riegeId: Number(params.id) },
        });

        // Delete each record individually
        for (const record of personRiegeRecords) {
            await prismaClient.personRiege.delete({
                where: {
                    personId_riegeId: {
                        riegeId: record.riegeId,
                        personId: record.personId,
                    },
                },
            });
        }

        try {
            leiter.forEach((leiterItem) => {
                let addedLeiter;

                // Define the async function and immediately invoke it
                (async () => {
                    addedLeiter = await prismaClient.riege.update({
                        where: { id: Number(params.id) },
                        data: {
                            person: {
                                connectOrCreate: {
                                    where: {
                                        personId_riegeId: {
                                            personId: leiterItem,
                                            riegeId: Number(params.id),
                                        },
                                    },
                                    create: {
                                        personId: leiterItem,
                                    },
                                },
                            },
                        },
                    });
                })();
            });
        } catch (e) {
            console.error("Failed to update Leiter " + e);
            return fail(500, { message: "Failed to update Leiter" });
        }

        try {
            try {
                await prismaClient.riege.update({
                    where: { id: Number(params.id) },
                    data: {
                        description: (formData.description as string) || "",
                        age: (formData.age as string) || "",
                    },
                });
            } catch (err) {
                console.error("Error updating Riege:", err);
                return fail(500, { message: "Failed to update Riege" });
            }

            const trainingszeit = await prismaClient.trainingszeit.findFirst({
                where: { riegeId: Number(params.id) },
            });

            if (trainingszeit) {
                try {
                    await prismaClient.trainingszeit.update({
                        where: { id: trainingszeit.id },
                        data: {
                            weekday: {
                                connect: {
                                    id: parseInt(formData.weekday as string),
                                },
                            },
                            from: new Date(`1970-01-01T${formData.from}:00Z`),
                            to: new Date(`1970-01-01T${formData.to}:00Z`),
                        },
                    });
                } catch (err) {
                    console.error("Error updating Trainingszeit:", err);
                    return fail(500, {
                        message: "Failed to update Trainingszeit",
                    });
                }
            }

            const trainingszeit2 = await prismaClient.trainingszeit.findFirst({
                where: { riegeId: Number(params.id) },
                skip: 1,
            });

            if (trainingszeit2) {
                if (formData.weekday2 && formData.from2 && formData.to2) {
                    try {
                        await prismaClient.trainingszeit.update({
                            where: { id: trainingszeit2.id },
                            data: {
                                weekday: {
                                    connect: {
                                        id: parseInt(
                                            formData.weekday2 as string
                                        ),
                                    },
                                },
                                from: new Date(
                                    `1970-01-01T${formData.from2}:00Z`
                                ),
                                to: new Date(`1970-01-01T${formData.to2}:00Z`),
                            },
                        });
                    } catch (err) {
                        console.error("Error creating Trainingszeit2:", err);
                        return fail(500, {
                            message: "Failed to create Trainingszeit2",
                        });
                    }
                } else {
                    try {
                        await prismaClient.trainingszeit.delete({
                            where: { id: trainingszeit2.id },
                        });
                    } catch (err) {
                        console.error("Error deleting Trainingszeit2:", err);
                        return fail(500, {
                            message: "Failed to delete Trainingszeit2",
                        });
                    }
                }
            } else if (formData.weekday2 && formData.from2 && formData.to2) {
                try {
                    await prismaClient.trainingszeit.create({
                        data: {
                            riege: {
                                connect: {
                                    id: Number(params.id),
                                },
                            },
                            weekday: {
                                connect: {
                                    id: parseInt(formData.weekday2 as string),
                                },
                            },
                            from: new Date(`1970-01-01T${formData.from2}:00Z`),
                            to: new Date(`1970-01-01T${formData.to2}:00Z`),
                        },
                    });
                } catch (err) {
                    console.error("Error updating Trainingszeit2:", err);
                    return fail(500, {
                        message: "Failed to update Trainingszeit2",
                    });
                }
            }
        } catch (err) {
            console.error("Error updating fields:", err);
            return fail(500, { message: "Failed to update fields" });
        }
    },

    deleteRiege: async ({ params, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/");
        }

        try {
            await prismaClient.riege.delete({
                where: { id: Number(params.id) },
            });
        } catch (err) {
            console.error("Error deleting entry:", err);

            return fail(500, { message: "Failed to delete entry" });
        }

        throw redirect(302, "/verwaltung/riege");
    },
    updateImage: async ({ params, locals, request }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, "/");
        }

        console.log("this fires");

        const formData = Object.fromEntries(await request.formData());

        let imageArray = [];

        if (formData.img1) {
            imageArray.push(parseInt(formData.img1 as string));
        }
        if (formData.img2) {
            imageArray.push(parseInt(formData.img2 as string));
        }
        if (formData.img3) {
            imageArray.push(parseInt(formData.img3 as string));
        }

        try {
            await prismaClient.riege.update({
                where: { id: Number(params.id) },
                data: {
                    image: {
                        set: imageArray?.map((id) => ({ id })),
                    },
                },
            });
        } catch (err) {
            console.error("Error updating images:", err);

            return fail(500, { message: "Failed to update images entry" });
        }
    },
};
