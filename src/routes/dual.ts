import { Router } from "express";
import fs from "fs";
import createJSONFromMarkdown from "../utils/parseMD";
import CheckAuth from "../middlware/auth";
import { onGoingDuals } from "..";

const app = Router();

app.get("/request", CheckAuth, (req, res) => {
    const files = fs.readdirSync("questions");
    const totalQuestions = files.length;
    const randomQuestion = Math.floor(Math.random() * totalQuestions);
    res.json(createJSONFromMarkdown(`questions/${files[randomQuestion]}`));
});

app.get("/check", CheckAuth, (req, res) => {
    const userId = req.params.userId;
    let inARoom = false;
    onGoingDuals.forEach((room) => {
        const [userId1, userId2] = room.roomId.split("<sep>");
        if (userId == userId1 || userId == userId2) inARoom = true;
    });
    return { inARoom };
});

export default app;
