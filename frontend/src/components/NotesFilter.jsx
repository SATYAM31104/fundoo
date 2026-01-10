import React from 'react';

const NotesFilter = ({ notes, searchQuery, children }) => {
    const filteredNotes = notes.filter(note =>
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return children({
        filteredNotes
    });
};

export default NotesFilter;
