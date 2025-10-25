const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");
const passport = require("passport");
const saltRounds = 10;

async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, saltRounds)
    } catch (error) {
        console.error("Error hashing password: ", error);
        throw new Error("Password hashing failed");
    }
}

module.exports.registerUser = async (req, res) => {
    try {

        console.log(req.body);
        

        const { username, password } = req.body;
        const hashedPassword = await hashPassword(password);

        const result = await prisma.user.findUnique({ where: { username } });
        if (result) return res.status(400).json({ message: "User already exists." });

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                profile: { create: {} },
            },
            include: { profile: true }
        });

        return res.status(200).json({ message: "Successfully created user", user})

    } catch (error) {
        console.error("Error registering user: ", error);
        res.status(500).json({ message: "Error registering user" });
    }
}

module.exports.userLoggin = async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return res.status(500).json({ error: "Server error." });

        if (!user) return res.status(400).json({ error: "Invalid username or password." });

        req.logIn(user, (error) => {
            if (error) return res.status(500).json({ error: "Session error." });
            
            return res.status(200).json({ message: "Successfully logged in." });
        })
    })(req, res, next)
}

module.exports.checkAuth = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not Authorized", loggedIn: false });

        const { password, ...safeUser } = req.user;

        return res.status(200).json({ loggedIn: true, user: safeUser });

    } catch (error) {
        console.error("User is not authenticated: ", error);
        res.status(500).json({ message: "User is not authenticated"})
    }
}