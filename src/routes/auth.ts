import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { authLogger } from "../logger";
import rateLimit from "express-rate-limit";

import db from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const app = Router();
const saltRounds = 10;

const signupSchema = z.object({
    username: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(6).max(255),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(255),
});

//* Rate limiter configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});

//* Apply rate limiting to specific routes
const signupLimiter = rateLimit({
    ...limiter,
    max: 3, // Stricter limit for signup
});

const loginLimiter = rateLimit({
    ...limiter,
    max: 5, // Slightly more lenient for login
});

/*
 * @route POST /signup
 * @desc Register a new user
 * @access Publicq
 * @body { username: string, email: string, password: string }
 * @response { message: string }
 */

app.post("/signup", signupLimiter, async (req, res) => {
    const body = signupSchema.safeParse(req.body);
    if (body.success) {
        const hashedPassword = bcrypt.hashSync(body.data.password, saltRounds);

        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, body.data.email))
            .limit(1);

        if (user.length > 0) {
            return res.status(400).json({ error: "User already exists!" });
        }

        db.insert(users)
            .values({
                email: body.data.email,
                username: body.data.username,
                password: hashedPassword,
            })
            .then(() => {
                authLogger.info(`${body.data.email} created a new account`);
                res.status(201).json({ message: "User created successfully!" });
            });
    } else {
        res.status(400).send(body.error);
    }
});

/*
 * @route POST /login
 * @desc Login a user
 * @access Public
 * @body { email: string, password: string }
 * @response { user: object }
 */

//TODO : Make this end point rate limited
app.post("/login", loginLimiter, async (req, res) => {
    const body = loginSchema.safeParse(req.body);
    if (body.success) {
        const user = await db.query.users.findFirst({
            where(fields, operators) {
                return eq(fields.email, body.data.email);
            },
        });

        if (!user) {
            return res.status(400).json({ error: "User does not exist!" });
        }

        const passwordMatch = bcrypt.compareSync(
            body.data.password,
            user.password
        );
        if (!passwordMatch) {
            authLogger.info(
                `${body.data.email} entered a wrong password while signing in`
            );
            return res.status(400).json({ error: "Invalid credentials!" });
        }
        authLogger.info(`${body.data.email} logged in!`);
        res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
            rating: user.rating,
        });
    } else {
        res.status(400).send(body.error);
    }
});

export default app;
