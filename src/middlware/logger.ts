import { Request, Response, NextFunction } from "express";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("URL:", req.url);
    console.log("Method:", req.method);

    if (req.body) {
        console.log("Body:", JSON.stringify(req.body, null, 2));
    }

    next();
};

export default loggerMiddleware;
