const express = require("express")
const router = express.Router();

const { login, signup } = require("../controllers/auth");
const { getUser, getAllUsers, updateUser, deleteUser } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);

// User CRUD operations
router.get("/user/:id", isAuthenticated, getUser);
router.get("/users", isAuthenticated, getAllUsers);
router.put("/user/update/:id", isAuthenticated, updateUser);
router.delete("/user/delete/:id", isAuthenticated, deleteUser);

module.exports = router;