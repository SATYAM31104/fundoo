const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Archive, Trash, Pin functionality
    isArchived: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    // Label functionality
    labels: [{
        type: String,
        trim: true
    }],
    // Collaborator functionality
    collaborators: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        email: {
            type: String,
            required: true
        },
        permission: {
            type: String,
            enum: ["read", "write"],
            default: "read"
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Additional metadata
    color: {
        type: String,
        default: "#ffffff"
    },
    reminder: {
        type: Date
    },
    // Checklist functionality
    checklist: [{
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true,
    // Add indexes for better search performance
    indexes: [
        { title: "text", description: "text" }, // Text search index
        { userId: 1, isDeleted: 1 }, // Query optimization
        { labels: 1 }, // Label search optimization
        { isPinned: -1, updatedAt: -1 } // Sorting optimization
    ]
});

// Create text index for search functionality
noteSchema.index({
    title: "text",
    description: "text",
    labels: "text"
});

module.exports = mongoose.model("Note", noteSchema);