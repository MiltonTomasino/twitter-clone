const router = require("express").Router();
const controller = require("../controllers/userController");

router.get("/check-auth", controller.checkAuth);
router.post("/register", controller.registerUser);
router.post("/login", controller.userLoggin);
router.get("/logout", (req, res, next) => {
    req.logout(function (error) {
        if (error) return next(error);
        
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.status(200).json({ message: "Successfully logged out." });
        })
    });
});

module.exports = router;
