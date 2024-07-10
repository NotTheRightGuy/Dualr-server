import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    username: varchar("username", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    rating: integer("rating").default(600).notNull(),
});
