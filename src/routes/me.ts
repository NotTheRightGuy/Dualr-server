import Router from "express";
import db from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { getTableColumns } from "drizzle-orm";
import { onGoingDuals } from "..";

const app = Router();

app.get("/", async (req, res) => {
    if (!req.query.email)
        return res.status(401).json({ message: "Please provide an email" });

    const { password, ...rest } = getTableColumns(users);
    const email = req.query.email as string;
    const user = await db
        .select({ ...rest })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    const userId = user[0].id;
    let inaDual: boolean = false;
    onGoingDuals.forEach((room) => {
        const userIdsOfMember = room.roomId.split("<sep>");
        if (userId == userIdsOfMember[0] || userId == userIdsOfMember[1]) {
            inaDual = true;
        }
    });
    if (!inaDual) {
        return res.json({ ...user[0], message: "No Ongoing Dual founds" });
    } else {
        return res.json({ ...user[0], message: "Already in Dual" });
    }
});

export default app;
