const Note = require("../models/notes");
const User = require("../models/user");
const redisClient = require("../config/redis");
const nodemailer = require("nodemailer");

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper function to get cache key
const getCacheKey = (userId, type = 'all') => `notes:${userId}:${type}`;

// Helper function to invalidate all cache for user
const invalidateUserCache = async (userId) => {
    try {
        const keys = [
            getCacheKey(userId, 'all'),
            getCacheKey(userId, 'archived'),
            getCacheKey(userId, 'trash'),
            getCacheKey(userId, 'pinned')
        ];
        await Promise.all(keys.map(key => redisClient.del(key)));
    } catch (error) {
        console.error("Cache invalidation error:", error);
    }
};

// CREATE: Create a new note
exports.createNote = async (req, res) => {
    try {
        const { title, description, labels, color, reminder } = req.body;
        const userId = req.user.id;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required"
            });
        }

        const note = await Note.create({
            title,
            description,
            userId,
            labels: labels || [],
            color: color || "#ffffff",
            reminder: reminder || null
        });

        // Invalidate cache
        await invalidateUserCache(userId);

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            note
        });

    } catch (error) {
        console.error("Create note error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create note"
        });
    }
};

// READ: Get all notes (with caching for initial 20)
exports.getAllNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = getCacheKey(userId, 'all');

        // Try to get from cache first
        try {
            const cachedNotes = await redisClient.get(cacheKey);
            if (cachedNotes) {
                return res.status(200).json({
                    success: true,
                    message: "Notes retrieved from cache",
                    cached: true,
                    notes: JSON.parse(cachedNotes)
                });
            }
        } catch (redisErr) {
            console.error("Redis Get Error:", redisErr);
        }

        // Get from database - initial 20 notes, pinned first
        const notes = await Note.find({ 
            userId, 
            isDeleted: false,
            isArchived: false
        })
        .sort({ isPinned: -1, updatedAt: -1 })
        .limit(20)
        .populate('collaborators.userId', 'name email');

        // Cache for 1 hour
        try {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(notes));
        } catch (redisErr) {
            console.error("Redis Set Error:", redisErr);
        }

        return res.status(200).json({
            success: true,
            message: "Notes retrieved successfully",
            cached: false,
            count: notes.length,
            notes
        });

    } catch (error) {
        console.error("Get notes error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve notes"
        });
    }
};

// READ: Get archived notes
exports.getArchivedNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = getCacheKey(userId, 'archived');

        // Try cache first
        try {
            const cachedNotes = await redisClient.get(cacheKey);
            if (cachedNotes) {
                return res.status(200).json({
                    success: true,
                    message: "Archived notes retrieved from cache",
                    cached: true,
                    notes: JSON.parse(cachedNotes)
                });
            }
        } catch (redisErr) {
            console.error("Redis Get Error:", redisErr);
        }

        const notes = await Note.find({ 
            userId, 
            isArchived: true,
            isDeleted: false
        })
        .sort({ updatedAt: -1 })
        .limit(20)
        .populate('collaborators.userId', 'name email');

        // Cache for 30 minutes
        try {
            await redisClient.setEx(cacheKey, 1800, JSON.stringify(notes));
        } catch (redisErr) {
            console.error("Redis Set Error:", redisErr);
        }

        return res.status(200).json({
            success: true,
            message: "Archived notes retrieved successfully",
            cached: false,
            count: notes.length,
            notes
        });

    } catch (error) {
        console.error("Get archived notes error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve archived notes"
        });
    }
};

// READ: Get trash notes
exports.getTrashNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = getCacheKey(userId, 'trash');

        // Try cache first
        try {
            const cachedNotes = await redisClient.get(cacheKey);
            if (cachedNotes) {
                return res.status(200).json({
                    success: true,
                    message: "Trash notes retrieved from cache",
                    cached: true,
                    notes: JSON.parse(cachedNotes)
                });
            }
        } catch (redisErr) {
            console.error("Redis Get Error:", redisErr);
        }

        const notes = await Note.find({ 
            userId, 
            isDeleted: true
        })
        .sort({ updatedAt: -1 })
        .limit(20)
        .populate('collaborators.userId', 'name email');

        // Cache for 15 minutes
        try {
            await redisClient.setEx(cacheKey, 900, JSON.stringify(notes));
        } catch (redisErr) {
            console.error("Redis Set Error:", redisErr);
        }

        return res.status(200).json({
            success: true,
            message: "Trash notes retrieved successfully",
            cached: false,
            count: notes.length,
            notes
        });

    } catch (error) {
        console.error("Get trash notes error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve trash notes"
        });
    }
};

// READ: Get pinned notes
exports.getPinnedNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = getCacheKey(userId, 'pinned');

        // Try cache first
        try {
            const cachedNotes = await redisClient.get(cacheKey);
            if (cachedNotes) {
                return res.status(200).json({
                    success: true,
                    message: "Pinned notes retrieved from cache",
                    cached: true,
                    notes: JSON.parse(cachedNotes)
                });
            }
        } catch (redisErr) {
            console.error("Redis Get Error:", redisErr);
        }

        const notes = await Note.find({ 
            userId, 
            isPinned: true,
            isDeleted: false
        })
        .sort({ updatedAt: -1 })
        .limit(20)
        .populate('collaborators.userId', 'name email');

        // Cache for 30 minutes
        try {
            await redisClient.setEx(cacheKey, 1800, JSON.stringify(notes));
        } catch (redisErr) {
            console.error("Redis Set Error:", redisErr);
        }

        return res.status(200).json({
            success: true,
            message: "Pinned notes retrieved successfully",
            cached: false,
            count: notes.length,
            notes
        });

    } catch (error) {
        console.error("Get pinned notes error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve pinned notes"
        });
    }
};

// UPDATE: Archive/Unarchive note
exports.toggleArchiveNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const userId = req.user.id;

        const note = await Note.findOne({ _id: noteId, userId, isDeleted: false });
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        note.isArchived = !note.isArchived;
        // If archiving, unpin the note
        if (note.isArchived) {
            note.isPinned = false;
        }
        
        await note.save();
        await invalidateUserCache(userId);

        return res.status(200).json({
            success: true,
            message: `Note ${note.isArchived ? 'archived' : 'unarchived'} successfully`,
            note
        });

    } catch (error) {
        console.error("Toggle archive error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle archive status"
        });
    }
};

// UPDATE: Pin/Unpin note
exports.togglePinNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const userId = req.user.id;

        const note = await Note.findOne({ _id: noteId, userId, isDeleted: false });
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        note.isPinned = !note.isPinned;
        // If pinning, unarchive the note
        if (note.isPinned) {
            note.isArchived = false;
        }
        
        await note.save();
        await invalidateUserCache(userId);

        return res.status(200).json({
            success: true,
            message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
            note
        });

    } catch (error) {
        console.error("Toggle pin error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle pin status"
        });
    }
};

// UPDATE: Add/Update labels
exports.updateLabels = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { labels } = req.body;
        const userId = req.user.id;

        if (!Array.isArray(labels)) {
            return res.status(400).json({
                success: false,
                message: "Labels must be an array"
            });
        }

        const note = await Note.findOneAndUpdate(
            { _id: noteId, userId, isDeleted: false },
            { labels: labels.filter(label => label.trim()) },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        await invalidateUserCache(userId);

        return res.status(200).json({
            success: true,
            message: "Labels updated successfully",
            note
        });

    } catch (error) {
        console.error("Update labels error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update labels"
        });
    }
};

// UPDATE: Update existing note
exports.updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { title, description, color, reminder } = req.body;
        const userId = req.user.id;

        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteId, userId, isDeleted: false },
            { 
                ...(title && { title }),
                ...(description && { description }),
                ...(color && { color }),
                ...(reminder !== undefined && { reminder })
            },
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        await invalidateUserCache(userId);

        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note: updatedNote
        });

    } catch (error) {
        console.error("Update note error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update note"
        });
    }
};

// DELETE: Move to trash (soft delete)
exports.moveToTrash = async (req, res) => {
    try {
        const { noteId } = req.params;
        const userId = req.user.id;

        const note = await Note.findOneAndUpdate(
            { _id: noteId, userId, isDeleted: false },
            { 
                isDeleted: true,
                isPinned: false,
                isArchived: false
            },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        await invalidateUserCache(userId);

        return res.status(200).json({
            success: true,
            message: "Note moved to trash successfully",
            note
        });

    } catch (error) {
        console.error("Move to trash error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to move note to trash"
        });
    }
};

// UPDATE: Restore from trash
exports.restoreFromTrash = async (req, res) => {
    try {
        const { noteId } = req.params;
        const userId = req.user.id;

        const note = await Note.findOneAndUpdate(
            { _id: noteId, userId, isDeleted: true },
            { isDeleted: false },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found in trash"
            });
        }

        await invalidateUserCache(userId);

        return res.status(200).json({
            success: true,
            message: "Note restored successfully",
            note
        });

    } catch (error) {
        console.error("Restore from trash error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to restore note"
        });
    }
};

// DELETE: Permanently delete note
exports.permanentDelete = async (req, res) => {
    try {
        const { noteId } = req.params;
        const userId = req.user.id;

        const note = await Note.findOneAndDelete({ _id: noteId, userId });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        await invalidateUserCache(userId);

        return res.status(200).json({
            success: true,
            message: "Note permanently deleted"
        });

    } catch (error) {
        console.error("Permanent delete error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to permanently delete note"
        });
    }
};

// SEARCH: Search notes by title and label
exports.searchNotes = async (req, res) => {
    try {
        const { query, labels } = req.query;
        const userId = req.user.id;

        if (!query && !labels) {
            return res.status(400).json({
                success: false,
                message: "Please provide search query or labels"
            });
        }

        let searchCriteria = {
            userId,
            isDeleted: false
        };

        // Text search
        if (query) {
            searchCriteria.$text = { $search: query };
        }

        // Label search
        if (labels) {
            const labelArray = labels.split(',').map(label => label.trim());
            searchCriteria.labels = { $in: labelArray };
        }

        const notes = await Note.find(searchCriteria)
            .sort({ score: { $meta: "textScore" }, updatedAt: -1 })
            .limit(50)
            .populate('collaborators.userId', 'name email');

        return res.status(200).json({
            success: true,
            message: "Search completed successfully",
            count: notes.length,
            searchQuery: query,
            searchLabels: labels,
            notes
        });

    } catch (error) {
        console.error("Search notes error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to search notes"
        });
    }
};

// COLLABORATOR: Add collaborator to note
exports.addCollaborator = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { email, permission = "read" } = req.body;
        const userId = req.user.id;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Find the note
        const note = await Note.findOne({ _id: noteId, userId, isDeleted: false });
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Find the user to collaborate with
        const collaboratorUser = await User.findOne({ email });
        if (!collaboratorUser) {
            return res.status(404).json({
                success: false,
                message: "User with this email not found"
            });
        }

        // Check if already a collaborator
        const existingCollaborator = note.collaborators.find(
            collab => collab.email === email
        );

        if (existingCollaborator) {
            return res.status(400).json({
                success: false,
                message: "User is already a collaborator"
            });
        }

        // Add collaborator
        note.collaborators.push({
            userId: collaboratorUser._id,
            email: email,
            permission: permission
        });

        await note.save();
        await invalidateUserCache(userId);

        // Send email notification
        try {
            const noteOwner = await User.findById(userId);
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `${noteOwner.name} shared a note with you - FundooNotes`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #4CAF50;">Note Shared with You!</h2>
                        <p>Hi <strong>${collaboratorUser.name}</strong>,</p>
                        <p><strong>${noteOwner.name}</strong> has shared a note with you on FundooNotes.</p>
                        
                        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">${note.title}</h3>
                            <p>${note.description.substring(0, 200)}${note.description.length > 200 ? '...' : ''}</p>
                            <p><strong>Permission:</strong> ${permission}</p>
                            ${note.labels.length > 0 ? `<p><strong>Labels:</strong> ${note.labels.join(', ')}</p>` : ''}
                        </div>
                        
                        <p>You can now access this note in your FundooNotes account.</p>
                        <p>Best regards,<br>The FundooNotes Team</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Collaboration email sent to ${email}`);
        } catch (emailError) {
            console.error("Failed to send collaboration email:", emailError);
        }

        return res.status(200).json({
            success: true,
            message: "Collaborator added successfully",
            note: await Note.findById(noteId).populate('collaborators.userId', 'name email')
        });

    } catch (error) {
        console.error("Add collaborator error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add collaborator"
        });
    }
};

// COLLABORATOR: Remove collaborator
exports.removeCollaborator = async (req, res) => {
    try {
        const { noteId, collaboratorId } = req.params;
        const userId = req.user.id;

        const note = await Note.findOne({ _id: noteId, userId, isDeleted: false });
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Remove collaborator
        note.collaborators = note.collaborators.filter(
            collab => collab._id.toString() !== collaboratorId
        );

        await note.save();
        await invalidateUserCache(userId);

        return res.status(200).json({
            success: true,
            message: "Collaborator removed successfully",
            note
        });

    } catch (error) {
        console.error("Remove collaborator error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove collaborator"
        });
    }
};

// READ: Get shared notes (notes where user is a collaborator)
exports.getSharedNotes = async (req, res) => {
    try {
        const userId = req.user.id;

        const notes = await Note.find({
            'collaborators.userId': userId,
            isDeleted: false
        })
        .sort({ updatedAt: -1 })
        .populate('userId', 'name email')
        .populate('collaborators.userId', 'name email');

        return res.status(200).json({
            success: true,
            message: "Shared notes retrieved successfully",
            count: notes.length,
            notes
        });

    } catch (error) {
        console.error("Get shared notes error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve shared notes"
        });
    }
};

// Legacy function for backward compatibility
exports.deleteNote = exports.moveToTrash;