import { createPool, sql } from "@vercel/postgres";
import { PRIVATE_VERCEL_POSTGRES_DB_URL } from "$env/static/private";
import { auth_user, user_session, user_key } from "$lib/server/db/tables";

async function seed() {
    const createTable = await sql(user_key, user_session, auth_user);

    console.log(`Created "riege" table`);

    return {
        createTable,
    };
}

export async function load() {
    const db = createPool({ connectionString: PRIVATE_VERCEL_POSTGRES_DB_URL });
    const startTime = Date.now();

    try {
        const { rows: users } = await db.query("SELECT * FROM users");
        const duration = Date.now() - startTime;
        return {
            users: users,
            duration: duration,
        };
    } catch (error) {
        if (error?.message === `relation "users" does not exist`) {
            console.log(
                "Table does not exist, creating and seeding it with dummy data now..."
            );
            // Table is not created yet
            await seed();
            const { rows: users } = await db.query("SELECT * FROM users");
            const duration = Date.now() - startTime;
            return {
                users: users,
                duration: duration,
            };
        } else {
            throw error;
        }
    }
}
