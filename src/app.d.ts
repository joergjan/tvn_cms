/// <reference types="svelte-adapter-azure-swa" />
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

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

    type Riege = {
        id: number;
        name: string;
        description: string;
        age: string;
        image?: Image[];
        person?: PersonRiege[];
        trainingszeiten?: Trainingszeit[];
    };

    type Role = {
        id: number;
        name: string;
        personId?: number | null;
    };

    type Person = {
        id: number;
        firstName: string;
        name: string;
        isVorstand: boolean | null;
        email: string;
        role?: Role | null;
        image?: Image | null;
        riegen?: PersonRiege[];
    };

    type Trainingszeit = {
        id: number;
        riegeId: number;
        weekdayId: number;
        from: Date;
        to: Date;
    };

    type Weekday = {
        id: number;
        name: string;
        trainingszeiten?: Trainingszeit[];
    };

    type Galery = {
        id: number;
        name: string;
        image?: Image[];
    };

    type PersonRiege = {
        personId: number;
        riegeId: number;
    };

    type Image = {
        id: number;
        url: string;
        date: Date;
        galeryId?: number;
        riegeId?: number;
        postId?: number;
        personId?: number;
    };

    type Post = {
        id: number;
        title: string;
        text: string;
        date: Date;
        image: Image[];
    };

    type User = {
        id: string;
        name: string;
        username: string;
        isAdmin: boolean;
        isEditor: boolean;
    };

    type Session = {
        id: string;
        user_id: string;
        active_expires: bigint;
        idle_expires: bigint;
    };

    type Key = {
        id: string;
        hashed_password: string | null;
        user_id: string;
    };
}

export {};
