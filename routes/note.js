const express = require("express");
const router = express.Router();

// Import controller functions
const {
    createNote,
    getAllNotes,
    getArchivedNotes,
    getTrashNotes,
    getPinnedNotes,
    updateNote,
    toggleArchiveNote,
    togglePinNote,
    updateLabels,
    moveToTrash,
    restoreFromTrash,
    permanentDelete,
    searchNotes,
    addCollaborator,
    removeCollaborator,
    getSharedNotes
} = require("../controllers/note");

// Import middleware
const { isAuthenticated } = require("../middlewares/auth");

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// ===== BASIC CRUD OPERATIONS =====
router.post("/", createNote);                          // CREATE note
router.get("/", getAllNotes);                          // READ all notes (cached 20)
router.put("/:noteId", updateNote);                    // UPDATE note

// ===== PART III: ARCHIVE, TRASH, PIN, LABEL =====
router.get("/archived", getArchivedNotes);             // READ archived notes
router.get("/trash", getTrashNotes);                   // READ trash notes  
router.get("/pinned", getPinnedNotes);                 // READ pinned notes

router.put("/:noteId/archive", toggleArchiveNote);     // TOGGLE archive
router.put("/:noteId/pin", togglePinNote);             // TOGGLE pin
router.put("/:noteId/labels", updateLabels);           // UPDATE labels

router.put("/:noteId/trash", moveToTrash);             // MOVE to trash
router.put("/:noteId/restore", restoreFromTrash);      // RESTORE from trash
router.delete("/:noteId/permanent", permanentDelete);  // PERMANENT delete

// ===== PART IV: SEARCH & COLLABORATION =====
router.get("/search", searchNotes);                    // SEARCH notes
router.get("/shared", getSharedNotes);                 // READ shared notes

router.post("/:noteId/collaborators", addCollaborator);        // ADD collaborator
router.delete("/:noteId/collaborators/:collaboratorId", removeCollaborator); // REMOVE collaborator

// ===== LEGACY ROUTES (for backward compatibility) =====
router.post("/create", createNote);
router.get("/getall", getAllNotes);
router.put("/update/:id", updateNote);
router.delete("/delete/:id", moveToTrash);

module.exports = router;