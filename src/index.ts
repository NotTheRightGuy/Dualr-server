import express from "express";
import cors from "cors";
import judge0server from "./utils/server";
import loggerMiddleware from "./middlware/logger";
import { createServer } from "http";
import { Server } from "socket.io";
import base64 from "base-64";
import createJSONFromMarkdown from "./utils/parseMD";
import fs from "fs";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});
const port = 8080;

app.use(express.json());
app.use(cors());
// app.use(loggerMiddleware);

const callback_url =
    "https://rnyys-2405-201-2007-103a-594b-631d-40a4-7aff.a.free.pinggy.link/webhook/submission";

//! IN MEMORY STORAGE
const socketIdOfUser = new Map<string, string>();
const onGoingSubmission = new Map<
    string,
    {
        user_id: string;
        socket_id: string;
        test_case_number: number;
    }
>();

//? Completed
app.get("/dual/request", (req, res) => {
    const files = fs.readdirSync("questions");
    const totalQuestions = files.length;
    const randomQuestion = Math.floor(Math.random() * totalQuestions);
    res.json(createJSONFromMarkdown(`questions/${files[randomQuestion]}`));
});

//* Socket.io
io.on("connection", (socket) => {
    socket.on("joined", (data) => {
        console.log(`User id with ${data} connected | Socket id: ${socket.id}`);
        socketIdOfUser.set(data, socket.id);
    });

    socket.on("disconnect", () => {
        console.log(`A user disconnected with socket id: ${socket.id}`);
        socketIdOfUser.forEach((value, key) => {
            if (value === socket.id) {
                socketIdOfUser.delete(key);
            }
        });
    });
});

/*
 * @route POST /judge/submission
 * @desc  Submit a single submission for judging
 * @access Public
 * @body { user_id, language_id, source_code }
 * @return { message: "Submission received" }
 */
app.post("/judge/submission", (req, res) => {
    const { user_id, language_id, source_code } = req.body;
    judge0server
        .post("/submissions", { language_id, source_code, callback_url })
        .then();
    res.json({ message: "Submission received" });
});

/*
 * @route POST /judge/submission/batch
 * @desc  Submit multiple submissions for judging
 * @access Public
 * @body { user_id, language_id, submissions: [source_code] }
 * @return { message: "Batch Submissions received", tokens: [token] }
 */

app.post("/judge/submission/batch", (req, res) => {
    const toSend: any = {
        submissions: [],
    };
    req.body.submissions.forEach((subm: any) => {
        toSend.submissions.push({
            language_id: req.body.language_id,
            source_code: subm,
            callback_url,
        });
    });
    judge0server.post("/submissions/batch", toSend).then((response) => {
        response.data.forEach((submission: any, index: number) => {
            onGoingSubmission.set(submission.token, {
                user_id: req.body.user_id,
                socket_id: socketIdOfUser.get(req.body.user_id) as string,
                test_case_number: index,
            });
        });
        return res.json({
            message: "Batch Submissions received",
            tokens: response.data,
        });
    });
});

app.put("/webhook/submission", (req, res) => {
    console.log("Submission result received for token " + req.body.token);
    const submission = onGoingSubmission.get(req.body.token);

    io.to(submission?.socket_id as string).emit("submission", {
        test_case_number: submission?.test_case_number,
        result: req.body,
    });

    res.status(200).send("Submission result received");
});

//! Completed
app.get("/", (req, res) => {
    res.send("Dualr Backend is running!");
});

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
