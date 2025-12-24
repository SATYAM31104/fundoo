const Note = require("../models/notes");

//create a  new note 
exports.createNote = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required"
            })
        }
        const note = await Note.create({
            title,
            description,
            userId: req.user.id
        })
        return res.status(200).json({
            success: true,
            message: "Note created successfully",
            note
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get all the notes for the user 
exports.getAllNotes = async (req, res) => {
    try {
        // FIX: user ID is in req.user.id, not _id
        const notes = await Note.find({ userId: req.user.id })
        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            notes
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//update the current notes
exports.updateNote = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required"
            })
        }
        // FIX: Ensure user owns the note and use {new:true}
        const UpdatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title, description },
            { new: true }
        )
        if (!UpdatedNote) {
            return res.status(404).json({
                success: false,
                message: "Note not found or authorized"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            UpdatedNote
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//delete a note 
exports.deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        })
        if (!deletedNote) {
            return res.status(404).json({
                success: false,
                message: "Note not found or authorized"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            deletedNote
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}