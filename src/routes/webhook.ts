import { Router } from "express";
import onGoingSubmission from "../classes/onGoingSubmission";
import { io } from "..";

const app = Router();

app.put("/submission", (req, res) => {
    console.log("Submission result received for token " + req.body.token);
    const submission = onGoingSubmission.get(req.body.token);

    io.to(submission?.socket_id as string).emit("submission", {
        test_case_number: submission?.test_case_number,
        result: req.body,
    });

    res.status(200).send("Submission result received");
});

export default app;
