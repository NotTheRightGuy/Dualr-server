import { Router } from "express";
import { onGoingDuals } from "..";
import { io } from "..";

const app = Router();

app.put("/submission", (req, res) => {
    console.log("Submission result received for token " + req.body.token);
    onGoingDuals.forEach((room) => {
        if (room.submissions.has(req.body.token)) {
            const submissionMaker = room.submissions.get(req.body.token);
            io.to(submissionMaker?.socket_id as string).emit("submission", {
                test_case_number: submissionMaker?.input_number,
                result: req.body,
            });
        }
    });

    res.status(200).send("Submission result received");
});

export default app;
