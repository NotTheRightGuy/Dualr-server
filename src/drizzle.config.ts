import { defineConfig } from "drizzle-kit";

const DB_URL =
    process.env.DB_URL || "postgresql://postgres:postgres@localhost:5432/";

console.log(DB_URL);
export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: DB_URL,
    },
    verbose: true,
    strict: true,
});
