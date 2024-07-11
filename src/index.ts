import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import routes from "./routes";
import { socketIdOfUser } from "./classes/socketIdOfUser";
import { lookingForMatch } from "./classes/lookingForMatch";
import { Room, Player } from "./classes/Room";

import fs from "fs";
import createJSONFromMarkdown from "./utils/parseMD";

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

//! REMOVE IN PRODUCTION
export const onGoingDuals: Room[] = [];

// TODO: Move all in memory Data structures to redis queue

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

    socket.on("reconnect", (data) => {
        const userId = data;
        onGoingDuals.forEach((room) => {
            const [userId1, userId2] = room.roomId.split("<sep>");
            if (userId == userId1) {
                room.player1.socketId = socket.id;
                socket.emit("re-connected", room);
            } else if (userId == userId2) {
                room.player2.socketId = socket.id;
                socket.emit("re-connected", room);
            }
        });
    });

    socket.on("arena", (data) => {
        const userId = data;
        onGoingDuals.forEach((room) => {
            const usersInvolved = room.roomId.split("<sep>");
            if (usersInvolved[0] == userId) {
                console.log(`Socket Id found for ${room.player1.username}`);
                room.player1.socketId = socket.id;
            }
            if (usersInvolved[1] == userId) {
                console.log(`Socket Id found for ${room.player2.username}`);
                room.player2.socketId = socket.id;
            }
            io.to(socket.id).emit("question", room.question);
        });
    });

    socket.on("end-dual", (data) => {
        console.log(data + " requested to terminate his dual");
        const userId = data;
        onGoingDuals.forEach((room, index) => {
            const [player1Id, player2Id] = room.roomId.split("<sep>");
            if (userId == player1Id) {
                // Declare player2 as winner and emit an event to let other person know
                onGoingDuals.splice(index, 1);
                return;
            } else if (userId == player2Id) {
                // Declare player1 as winner and emit an event to tlet other person know
                onGoingDuals.splice(index, 1);
                return;
            }
        });
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

                //TODO : Check that this player is not present in any other rooms

                const player1: Player = {
                    userId: user1.id,
                    username: user1.username,
                    rating: user1.rating,
                    testCasesPassed: 0,
                    socketId: null,
                };

                const player2: Player = {
                    userId: user2.id,
                    username: user2.username,
                    rating: user2.rating,
                    testCasesPassed: 0,
                    socketId: null,
                };

                const files = fs.readdirSync("questions");
                const totalQuestions = files.length;
                const randomQuestion = Math.floor(
                    Math.random() * totalQuestions
                );
                const question = createJSONFromMarkdown(
                    `questions/${files[randomQuestion]}`
                );

                const newRoom = new Room(
                    player1,
                    player2,
                    user1.id + "<sep>" + user2.id,
                    question
                );

                onGoingDuals.push(newRoom);

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
