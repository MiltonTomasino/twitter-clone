const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { getUserByUsername, getUserById } = require("./controllers/passportUtils");

function validatePassword(password, storedPassword) {
    return bcrypt.compare(password, storedPassword);
}

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await getUserByUsername(username);
        if (!user) return done(null, false);

        const isValid = await validatePassword(password, user.password);
        return isValid ? done(null, user) : done(null, false);
    } catch (error) {
        return done(error)
    }
}));

passport.serializeUser(async (user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserById(id);
        done(null, user);
    } catch (error) {
        done(console.error());
    }
})

