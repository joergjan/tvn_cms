import { lucia } from "lucia";
import { postgres as postgresAdapter } from "@lucia-auth/adapter-postgresql";
import postgres from "postgres";
import { PRIVATE_VERCEL_POSTGRES_DB_URL } from "$env/static/private";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";

const sql = postgres(PRIVATE_VERCEL_POSTGRES_DB_URL);

export const auth = lucia({
    adapter: postgresAdapter(sql, {
        user: "auth_user",
        key: "user_key",
        session: "user_session",
    }),
    env: dev ? "DEV" : "PROD",
    middleware: sveltekit(),
    getUserAttributes: (data) => {
        return {
            username: data.username,
        };
    },
});

export type Auth = typeof auth;
