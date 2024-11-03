import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    username: varchar("username", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    rating: integer("rating").default(600).notNull(),
});

export const history = pgTable("history", {
    id: uuid("id").defaultRandom().primaryKey(),

    player1Id: uuid("player1Id").notNull(),
    player1Username: varchar("player1Username", { length: 255 }).notNull(),
    player1Delta: integer("player1Delta").notNull(),

    player2Id: uuid("player2Id").notNull(),
    player2Username: varchar("player2Username", { length: 255 }).notNull(),
    player2Delta: integer("player2Delta").notNull(),

    winner: varchar("winner", { length: 255 }).notNull(),
    totalTimeTaken: integer("totalTimeTaken").notNull(),
});
