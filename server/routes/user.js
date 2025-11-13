const router = require("express").Router();
const controller = require("../controllers/userController");

// account routes
router.get("/user/check-auth", controller.checkAuth);
router.post("/user", controller.getUser);
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
router.get("/user/profile", controller.getProfile);
router.post("/user/chat", controller.createChat);
router.get("/user/chats", controller.getChats);
router.post("/user/post/:postId", controller.likePost);

// request routes
router.get("/user/follow-status", controller.followStatus);
router.post("/user/follow-request", controller.followRequest);
router.get("/user/notifications", controller.getRequests);
router.post("/user/update-follow", controller.updateRequestStatus);
router.delete("/user/unfollow", controller.unfollowUser);

// post routes
router.get("/user/all-posts", controller.getAllPosts);
router.post("/user/post", controller.createPost);
router.get("/user/posts", controller.getUserPosts);
router.post("/user/post/:postId/comment", controller.submitComment);


module.exports = router;
