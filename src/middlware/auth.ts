import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function CheckAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization?.split(" ")[1] as string;
    if (token) {
        try {
            const check = jwt.verify(token, process.env.AUTH_SECRET as string);
            req.body.token_data = check;
            next();
        } catch (err) {
            return res.status(400).json({ message: "Malformed JWT Found" });
        }
    }

    return res
        .status(401)
        .json({ message: "You must be logged in to do that" });
}
