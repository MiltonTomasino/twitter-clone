const express = require("express");
const passport = require("passport");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./db/prisma");
const PORT = process.env.PORT || 3000;
const userRouter = require("./routes/user");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

require("dotenv").config();
require("./passport")

const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    expressSession({
        cookie: {
            maxAge: 1000 * 60 * 60
        },
        secret: process.env.SESSION_SECRET || "dev_secret",
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(
            prisma,
            {
                checkPeriod: 1000 * 60 * 2,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    })
)

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", userRouter);

io.on("connection", (socket) => {

    socket.on("joinChat", async (chatId) => {
        socket.join(chatId);
        const messages = await prisma.message.findMany({
            where: { chatId },
        })
        console.log(`User joined chat ${chatId}`);
        socket.emit("chatHistory", messages);
    });

    socket.on("sendMessage", async ({ chatId, message, userId }) => {
        const newMessage = await prisma.message.create({
            data: {
                userId,
                chatId, 
                text: message
            }
        })
        io.to(chatId).emit("newMessage", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
        
    })
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));