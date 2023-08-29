const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/authController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// router.post("/register", register);
// router.post("/login", login);
// router.get("/logout", logout);

module.exports = router;
