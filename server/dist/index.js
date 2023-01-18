"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const http = __importStar(require("http"));
const cors_1 = __importDefault(require("cors"));
const node_cron_1 = __importDefault(require("node-cron"));
const controller_1 = __importDefault(require("./functions/controller"));
const removeData_1 = __importDefault(require("./functions/removeData"));
const socketio = __importStar(require("socket.io"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const httpServer = http.createServer(app);
// Using socket.io to emit data to the frontend
const socketIO = new socketio.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
socketIO.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🐦: ${socket.id} user just connected!`);
    socket.on("disconnect", () => {
        console.log("🦤: A user disconnected");
    });
}));
// Query the drone coordinates API every second and store the data in the database. Also data to the frontend
node_cron_1.default.schedule("*/1 * * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, controller_1.default)();
        socketIO.emit("data", data);
    }
    catch (err) {
        console.error(err);
    }
}));
// Clean up the database every 10 seconds removing pilots that have not been seen in TIME_LIMIT seconds
node_cron_1.default.schedule("*/10 * * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, removeData_1.default)();
    }
    catch (err) {
        console.error(err);
    }
}));
httpServer.listen("8080", () => {
    console.log("Server running");
});
