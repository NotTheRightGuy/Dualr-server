import auth from "./auth";
import dual from "./dual";
import judge from "./judge";
import webhook from "./webhook";
import me from "./me";
import { Router } from "express";

const app = Router();

app.use("/auth", auth);
app.use("/dual", dual);
app.use("/judge", judge);
app.use("/webhook", webhook);
app.use("/me", me);

export default app;
