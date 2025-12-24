const express = require("express");
const router = express.Router();

//importing the controllers and middleware in the notes routes
const { createNote, getAllNotes, updateNote, deleteNote } = require("../controllers/note");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/create", isAuthenticated, createNote);
router.get("/getall", isAuthenticated, getAllNotes);
router.put("/update/:id", isAuthenticated, updateNote);
router.delete("/delete/:id", isAuthenticated, deleteNote);

module.exports = router;