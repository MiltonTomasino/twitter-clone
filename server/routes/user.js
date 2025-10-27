const router = require("express").Router();
const controller = require("../controllers/userController");

// user routes
router.get("/user/check-auth", controller.checkAuth);
router.post("/user/register", controller.registerUser);
router.post("/user/login", controller.userLoggin);
router.get("/user/logout", (req, res, next) => {
    req.logout(function (error) {
        if (error) return next(error);
        
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.status(200).json({ message: "Successfully logged out." });
        })
    });
});

// profile routes
router.get("/user/:userId/profile", controller.getProfile);

module.exports = router;
