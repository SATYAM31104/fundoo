import React, { useState, useEffect, Profiler } from 'react';
import { useParams } from 'react-router-dom';
import { getNotes, createNote, updateNote, deleteNote, toggleArchive, togglePin } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import CreateNote from '../components/CreateNote';
import Modal from '../components/Modal';
import NoteEditor from '../components/NoteEditor';
import NotesFilter from '../components/NotesFilter';
import { useLabels } from '../context/LabelContext';
import '../styles/Dashboard.css';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Dashboard = () => {
    const { labelName } = useParams();
    const { refreshLabels } = useLabels();
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedNote, setSelectedNote] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await getNotes();
            if (response.data.success) {
                setNotes(response.data.notes);
            }
        } catch (err) {
            console.error("Failed to fetch notes", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(notes);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setNotes(items);
    };

    const onRenderCallback = (id, phase, actualDuration) => {
        // console.log(`Profiler [${id}] phase [${phase}] duration [${actualDuration}ms]`);
    };

    const handleCreateNote = async (newNote) => {
        try {
            // Automatically add current label if on a label page
            const noteToCreate = { ...newNote };
            if (labelName) {
                if (!noteToCreate.labels) noteToCreate.labels = [];
                if (!noteToCreate.labels.includes(labelName)) {
                    noteToCreate.labels.push(labelName);
                }
            }

            const response = await createNote(noteToCreate);
            if (response.data.success) {
                setNotes([response.data.note, ...notes]);
                refreshLabels();
            }
        } catch (err) {
            console.error("Failed to create note", err);
        }
    };

    const handleUpdateNote = async (id, data) => {
        try {
            let response;
            if (data.isArchived !== undefined) {
                response = await toggleArchive(id);
            } else if (data.isPinned !== undefined) {
                response = await togglePin(id);
            } else {
                response = await updateNote(id, data);
            }

            if (response.data.success) {
                const updatedNoteData = response.data.note;
                setNotes(notes.map(n => n._id === id ? { ...n, ...updatedNoteData } : n));
                refreshLabels();

                if (updatedNoteData.isArchived || updatedNoteData.isDeleted) {
                    setNotes(notes.filter(n => n._id !== id));
                }
            }
        } catch (err) {
            console.error("Failed to update note", err);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await deleteNote(id);
            setNotes(notes.filter(n => n._id !== id));
        } catch (err) {
            console.error("Failed to delete note", err);
        }
    };

    // Filter by label first if labelName is present
    const displayedNotes = notes.filter(n => {
        const isNotSpecial = !n.isArchived && !n.isDeleted;
        if (!labelName) return isNotSpecial;
        return isNotSpecial && n.labels?.includes(labelName);
    });

    const pinnedNotes = displayedNotes.filter(n => n.isPinned);
    const otherNotes = displayedNotes.filter(n => !n.isPinned);

    return (
        <div className="keep-layout">
            <Navbar
                onSearch={setSearchQuery}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <div className="keep-main-content">
                <Sidebar isOpen={isSidebarOpen} />
                <main className="keep-notes-area">
                    <CreateNote onCreate={handleCreateNote} />

                    <Profiler id="NotesGrid" onRender={onRenderCallback}>
                        <NotesFilter notes={displayedNotes} searchQuery={searchQuery}>
                            {({ filteredNotes }) => {
                                const fPinned = filteredNotes.filter(n => n.isPinned);
                                const fOthers = filteredNotes.filter(n => !n.isPinned);

                                return (
                                    <div className="notes-container">
                                        {fPinned.length > 0 && (
                                            <div className="notes-section">
                                                <h3 className="section-label">PINNED</h3>
                                                <div className="keep-notes-grid">
                                                    {fPinned.map((note) => (
                                                        <NoteCard
                                                            key={note._id}
                                                            note={note}
                                                            onUpdate={handleUpdateNote}
                                                            onDelete={handleDeleteNote}
                                                            onClick={setSelectedNote}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {fPinned.length > 0 && fOthers.length > 0 && <h3 className="section-label">OTHERS</h3>}

                                        <div className="keep-notes-grid">
                                            {fOthers.length > 0 ? (
                                                fOthers.map((note) => (
                                                    <NoteCard
                                                        key={note._id}
                                                        note={note}
                                                        onUpdate={handleUpdateNote}
                                                        onDelete={handleDeleteNote}
                                                        onClick={setSelectedNote}
                                                    />
                                                ))
                                            ) : (
                                                !fPinned.length && (
                                                    <div className="keep-empty-state">
                                                        <p>{loading ? 'Loading...' : 'No notes found'}</p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
                        </NotesFilter>
                    </Profiler>
                </main>
            </div>

            <Modal isOpen={!!selectedNote} onClose={() => setSelectedNote(null)}>
                {selectedNote && (
                    <NoteEditor
                        note={selectedNote}
                        onSave={handleUpdateNote}
                        onClose={() => setSelectedNote(null)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Dashboard;
