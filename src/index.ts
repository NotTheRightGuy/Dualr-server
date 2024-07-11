import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import routes from "./routes";
import { socketIdOfUser } from "./classes/socketIdOfUser";
import { lookingForMatch } from "./classes/lookingForMatch";
import { client, makeRedisClient } from "./redis";

dotenv.config();
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

export { io };
const PORT = 8080;

//? Middleware

app.use(express.json());
app.use(cors());

//? Routes
app.use("/api", routes);

//? Socket.io
io.on("connection", (socket) => {
    console.log(`User with socket id: ${socket.id} connected`);
    socket.on("joined", (data) => {
        console.log(`User id with ${data} connected | Socket id: ${socket.id}`);
        socketIdOfUser.set(data.id, socket.id);
    });

    socket.on("disconnect", () => {
        console.log(`A user disconnected with socket id: ${socket.id}`);
        socketIdOfUser.forEach((value, key) => {
            if (value === socket.id) {
                socketIdOfUser.delete(key);
            }
        });
        lookingForMatch.forEach(async (value, key) => {
            if (value === socket.id) {
                lookingForMatch.delete(key);
                console.log(`${key} removed from match making queue`);
            }

            try {
                const queueLength = await client.llen("finding");
                for (let i = 0; i < queueLength; i++) {
                    const user = await client.lindex("finding", i);
                    const userData = JSON.parse(user as string);
                    if (userData.id === key) {
                        await client.lrem("finding", 1, user as string);
                        console.log(
                            `${userData.username} removed from Redis queue`
                        );
                        break;
                    }
                }
            } catch (err) {
                console.log("Error removing user from Redis queue:", err);
            }
        });
    });

    socket.on("find", async (data) => {
        console.log(`${data.username} looking for a dual`);
        lookingForMatch.set(data.id, socket.id);
        try {
            await client.lpush("finding", JSON.stringify(data));
            console.log(data.username + " Added to queue");
        } catch (err) {
            console.log("Error pushing to queue");
        }
    });
});

//? Redis Worker
async function startWorker() {
    while (true) {
        if (!client) continue;
        try {
            const queueLength = await client.llen("finding");
            if (queueLength >= 2) {
                const newFinders = await client.lrange("finding", 0, 1);
                await client.ltrim("finding", 2, -1);
                const user1 = JSON.parse(newFinders[0]);
                const user2 = JSON.parse(newFinders[1]);
                lookingForMatch.forEach((value, key) => {
                    if (key == user1.id) {
                        io.to(value).emit("found", user2);
                    }
                    if (key == user2.id) {
                        io.to(value).emit("found", user1);
                    }
                });
                console.log(
                    `${user1.username} found a dual with ${user2.username} | ${user1.rating} vs ${user2.rating}`
                );
                lookingForMatch.delete(user1.id);
                lookingForMatch.delete(user2.id);
            }
        } catch (err) {
            console.log(err, "Error processing queue");
        }
    }
}

app.get("/", (req, res) => {
    res.send("Dualr Backend is running! Bhow");
});

httpServer.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    makeRedisClient();
    startWorker();
});
