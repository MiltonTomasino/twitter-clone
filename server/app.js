const express = require("express");
const passport = require("passport");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./db/prisma");
const PORT = process.env.PORT || 3000;
const userRouter = require("./routes/user");
require("dotenv").config();
require("./passport")

const app = express();

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

app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));