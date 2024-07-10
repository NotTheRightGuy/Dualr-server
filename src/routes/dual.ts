import { Router } from "express";
import fs from "fs";
import createJSONFromMarkdown from "../utils/parseMD";

const app = Router();

app.get("/request", (req, res) => {
    const files = fs.readdirSync("questions");
    const totalQuestions = files.length;
    const randomQuestion = Math.floor(Math.random() * totalQuestions);
    res.json(createJSONFromMarkdown(`questions/${files[randomQuestion]}`));
});

export default app;
