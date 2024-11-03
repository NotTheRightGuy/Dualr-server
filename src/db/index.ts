import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";

const DB_URL =
    process.env.DB_URL || "postgresql://postgres:postgres@localhost:5432/";

const client = postgres(DB_URL as string);
export default drizzle(client, { schema });
