/// <reference types="svelte-adapter-azure-swa" />
import { PrismaClient } from "@prisma/client/edge";

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            auth: import("lucia").AuthRequest;
        }
        // interface PageData {}
        // interface Platform {}
    }
    var __prisma: PrismaClient;

    /// <reference types="lucia-auth" />
    declare namespace Lucia {
        type Auth = import("$lib/server/db/lucia").Auth;
        type UserAttributes = {
            username: string;
            name: string;
        };
        type DatabaseSessionAttributes = {};
    }

    declare namespace tvn {
        type Riege = {
            id: number;
            name: string;
            description: string;
            age: string;
            person: PersonRiege[];
            trainingszeiten: Trainingszeit[];
            image: Image[];
        };

        type Role = {
            id: number;
            name: string;
        };

        type Person = {
            id: number;
            firstName: string;
            name: string;
            isVorstand: boolean;
            email: string;
            roleId: number;
            avatar?: Avatar;
            riegen: PersonRiege[];
        };

        type Trainingszeit = {
            id: number;
            riege: Riege;
            riegeId: number;
            weekday: Weekday;
            weekdayId: number;
            from: Date;
            to: Date;
        };

        type Weekday = {
            id: number;
            name: string;
            trainingszeiten: Trainingszeit[];
        };

        type ImageFolder = {
            id: number;
            name: string;
            image: Image[];
        };

        type PersonRiege = {
            person: Person;
            personId: number;
            riege: Riege;
            riegeId: number;
        };

        type Image = {
            id: number;
            url: string;
            date: Date;
            riege: Riege;
            riegeId: number;
            imageFolder: ImageFolder;
            imageFolderId: number;
        };

        type Avatar = {
            id: number;
            url: string;
            date: Date;
            person: Person;
            personId: number;
        };

        type Post = {
            id: number;
        };
    }
}

export {};
