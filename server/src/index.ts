import express from "express";
require("dotenv").config();

import * as http from "http";
import cors from "cors";
import cron from 'node-cron';
import controller from "./functions/controller";
import removeData from "./functions/removeData";
import * as socketio from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);

// Using socket.io to emit data to the frontend
const socketIO = new socketio.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

socketIO.on("connection", async (socket) => {
    console.log(`🐦: ${socket.id} user just connected!`);
    socket.on("disconnect", () => {
        console.log("🦤: A user disconnected");
    });
}); 

// Query the drone coordinates API every second and store the data in the database. Also data to the frontend
cron.schedule("*/1 * * * * *", async () => {
    try {
        const data = await controller();
        socketIO.emit("data", data);
    } catch (err) {
        console.error(err);
    }
});

// Clean up the database every 10 seconds removing pilots that have not been seen in TIME_LIMIT seconds
cron.schedule("*/10 * * * * *", async () => {
    try {
        await removeData();
    } catch (err) {
        console.error(err);
    }
});

httpServer.listen("8080", (): void => {
    console.log("Server running");
});
