import React, { useState } from 'react';
import { Archive, Trash2, Pin, Bell, UserPlus, Palette, MoreVertical, X, Plus, List } from 'lucide-react';
import ColorPicker from './ColorPicker';
import NoteLabelsPopover from './NoteLabelsPopover';
import { createLabel as apiCreateLabel } from '../services/api';

const NoteEditor = ({ note, onSave, onClose }) => {
    const [editedNote, setEditedNote] = useState({
        ...note,
        labels: note.labels || [],
        checklist: note.checklist || [],
        color: note.color || 'default'
    });
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showLabelsPopover, setShowLabelsPopover] = useState(false);
    const [isChecklist, setIsChecklist] = useState(note.checklist?.length > 0);

    const handleSave = () => {
        onSave(editedNote._id, editedNote);
        onClose();
    };

    const addChecklistItem = () => {
        setEditedNote({
            ...editedNote,
            checklist: [...editedNote.checklist, { text: '', completed: false }]
        });
    };

    const updateChecklistItem = (index, value) => {
        const newChecklist = [...editedNote.checklist];
        newChecklist[index].text = value;
        setEditedNote({ ...editedNote, checklist: newChecklist });
    };

    const toggleChecklistItem = (index) => {
        const newChecklist = [...editedNote.checklist];
        newChecklist[index].completed = !newChecklist[index].completed;
        setEditedNote({ ...editedNote, checklist: newChecklist });
    };

    const removeChecklistItem = (index) => {
        const newChecklist = editedNote.checklist.filter((_, i) => i !== index);
        setEditedNote({ ...editedNote, checklist: newChecklist });
    };

    const handleToggleLabel = (label) => {
        const currentLabels = editedNote.labels || [];
        const newLabels = currentLabels.includes(label)
            ? currentLabels.filter(l => l !== label)
            : [...currentLabels, label];
        setEditedNote({ ...editedNote, labels: newLabels });
    };

    const handleAddNewLabel = async (label) => {
        await apiCreateLabel(label);
        handleToggleLabel(label);
    };

    const removeLabel = (labelToRemove) => {
        setEditedNote({
            ...editedNote,
            labels: editedNote.labels.filter(label => label !== labelToRemove)
        });
    };

    return (
        <div className={`note-editor ${editedNote.color && editedNote.color !== 'default' ? `color-${editedNote.color}` : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="create-header">
                <input
                    placeholder="Title"
                    value={editedNote.title}
                    className="title-input"
                    onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
                />
                <button
                    className={`pin-btn ${editedNote.isPinned ? 'active' : ''}`}
                    onClick={() => setEditedNote({ ...editedNote, isPinned: !editedNote.isPinned })}
                >
                    <Pin size={20} />
                </button>
            </div>

            {isChecklist ? (
                <div className="checklist-container">
                    {editedNote.checklist.map((item, index) => (
                        <div key={index} className="checklist-input-item">
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => toggleChecklistItem(index)}
                            />
                            <input
                                placeholder="List item"
                                value={item.text}
                                onChange={(e) => updateChecklistItem(index, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') addChecklistItem();
                                }}
                            />
                            <button onClick={() => removeChecklistItem(index)}><X size={16} /></button>
                        </div>
                    ))}
                    <div className="checklist-add" onClick={addChecklistItem}>
                        <Plus size={18} />
                        <span>List item</span>
                    </div>
                </div>
            ) : (
                <textarea
                    placeholder="Take a note..."
                    value={editedNote.description}
                    onChange={(e) => setEditedNote({ ...editedNote, description: e.target.value })}
                    rows={5}
                    style={{ width: '100%', border: 'none', outline: 'none', padding: '12px 16px', fontSize: '1.1rem', resize: 'none', background: 'transparent' }}
                />
            )}

            {editedNote.labels && editedNote.labels.length > 0 && (
                <div className="create-note-labels" style={{ padding: '0 16px 8px' }}>
                    {editedNote.labels.map((label, idx) => (
                        <span key={idx} className="label-chip">
                            {label}
                            <X size={12} onClick={() => removeLabel(label)} />
                        </span>
                    ))}
                </div>
            )}

            <div className="create-footer">
                <div className="footer-tools">
                    <button title="Remind me"><Bell size={18} /></button>
                    <button title="Collaborator"><UserPlus size={18} /></button>
                    <div style={{ position: 'relative' }}>
                        <button title="Colors" onClick={() => setShowColorPicker(!showColorPicker)}>
                            <Palette size={18} />
                        </button>
                        {showColorPicker && (
                            <ColorPicker
                                selectedColor={editedNote.color}
                                onSelect={(color) => {
                                    setEditedNote({ ...editedNote, color });
                                    setShowColorPicker(false);
                                }}
                            />
                        )}
                    </div>
                    <button title="Archive" onClick={() => setEditedNote({ ...editedNote, isArchived: !editedNote.isArchived })}>
                        <Archive size={18} className={editedNote.isArchived ? 'active-icon' : ''} />
                    </button>
                    <div style={{ position: 'relative' }}>
                        <button title="Labels" onClick={() => setShowLabelsPopover(!showLabelsPopover)}>
                            <MoreVertical size={18} />
                        </button>
                        {showLabelsPopover && (
                            <NoteLabelsPopover
                                noteLabels={editedNote.labels || []}
                                onToggleLabel={handleToggleLabel}
                                onAddNewLabel={handleAddNewLabel}
                            />
                        )}
                    </div>
                    <button title="Toggle Checklist" onClick={() => setIsChecklist(!isChecklist)}>
                        <List size={18} className={isChecklist ? 'active-icon' : ''} />
                    </button>
                </div>
                <button className="close-btn" onClick={handleSave}>Close</button>
            </div>
        </div>
    );
};

export default NoteEditor;
