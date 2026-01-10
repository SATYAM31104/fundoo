import React, { useState, useEffect } from 'react';
import API, { toggleArchive, deleteNote } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import '../styles/Dashboard.css';

const Archive = () => {
    const [archivedNotes, setArchivedNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        fetchArchivedNotes();
    }, []);

    const fetchArchivedNotes = async () => {
        try {
            const response = await API.get('/notes/archived');
            if (response.data.success) {
                setArchivedNotes(response.data.notes);
            }
        } catch (err) {
            console.error("Failed to fetch archived notes", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnarchive = async (id) => {
        try {
            await toggleArchive(id);
            setArchivedNotes(archivedNotes.filter(n => n._id !== id));
        } catch (err) {
            console.error("Failed to unarchive note", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNote(id);
            setArchivedNotes(archivedNotes.filter(n => n._id !== id));
        } catch (err) {
            console.error("Failed to delete note", err);
        }
    };

    return (
        <div className="keep-layout">
            <Navbar onSearch={() => { }} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="keep-main-content">
                <Sidebar isOpen={isSidebarOpen} />
                <main className="keep-notes-area">
                    <h2 className="page-headline">Archive</h2>
                    <div className="keep-notes-grid">
                        {archivedNotes.length > 0 ? (
                            archivedNotes.map(note => (
                                <NoteCard
                                    key={note._id}
                                    note={note}
                                    onUpdate={handleUnarchive}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <div className="keep-empty-state">
                                <p>{loading ? 'Loading...' : 'No archived notes'}</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Archive;
