import React, { useState, useEffect } from 'react';
import API, { restoreNote, permanentDeleteNote } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import '../styles/Dashboard.css';

const Trash = () => {
    const [trashNotes, setTrashNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        fetchTrashNotes();
    }, []);

    const fetchTrashNotes = async () => {
        try {
            const response = await API.get('/notes/trash');
            if (response.data.success) {
                setTrashNotes(response.data.notes);
            }
        } catch (err) {
            console.error("Failed to fetch trash notes", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        try {
            await restoreNote(id);
            setTrashNotes(trashNotes.filter(n => n._id !== id));
        } catch (err) {
            console.error("Failed to restore note", err);
        }
    };

    const handlePermanentDelete = async (id) => {
        try {
            await permanentDeleteNote(id);
            setTrashNotes(trashNotes.filter(n => n._id !== id));
        } catch (err) {
            console.error("Failed to delete note permanently", err);
        }
    };

    return (
        <div className="keep-layout">
            <Navbar onSearch={() => { }} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="keep-main-content">
                <Sidebar isOpen={isSidebarOpen} />
                <main className="keep-notes-area">
                    <div className="trash-header-info">
                        <h2 className="page-headline">Trash</h2>
                        <button className="empty-trash-btn">Empty Trash</button>
                    </div>
                    <div className="keep-notes-grid">
                        {trashNotes.length > 0 ? (
                            trashNotes.map(note => (
                                <NoteCard
                                    key={note._id}
                                    note={note}
                                    isTrash={true}
                                    onRestore={handleRestore}
                                    onPermanentDelete={handlePermanentDelete}
                                />
                            ))
                        ) : (
                            <div className="keep-empty-state">
                                <p>{loading ? 'Loading...' : 'Trash is empty'}</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Trash;
