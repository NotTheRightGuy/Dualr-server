import Router from "express";
import db from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { getTableColumns } from "drizzle-orm";

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

    return res.json(user[0]);
});

export default app;
