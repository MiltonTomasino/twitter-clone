const router = require("express").Router();
const controller = require("../controllers/userController");

router.get("/check-auth", controller.checkAuth);
router.post("/register", controller.registerUser);

module.exports = router;
