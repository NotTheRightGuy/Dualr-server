import { Router } from "express";
import judge0server from "../utils/server";
import callback_url from "../config";
import { socketIdOfUser } from "../classes/socketIdOfUser";

const app = Router();
import onGoingSubmission from "../classes/onGoingSubmission";

/*
 * @route POST /judge/submission
 * @desc  Submit a single submission for judging
 * @access Public
 * @body { user_id, language_id, source_code }
 * @return { message: "Submission received" }
 */
app.post("/submission", (req, res) => {
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

app.post("/submission/batch", (req, res) => {
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

export default app;
