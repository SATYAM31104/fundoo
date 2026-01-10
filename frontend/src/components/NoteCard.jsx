import React, { useState } from 'react';
import { Archive, Trash2, Pin, UserPlus, Palette, Bell, RotateCcw, XCircle, MoreVertical, Check } from 'lucide-react';
import { createLabel as apiCreateLabel } from '../services/api';
import NoteLabelsPopover from './NoteLabelsPopover';
import ColorPicker from './ColorPicker';
import '../styles/NoteCard.css';
import withAnimation from './withAnimation';

const NoteCard = ({ note, onUpdate, onDelete, onClick, isTrash, onRestore, onPermanentDelete }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showLabelsPopover, setShowLabelsPopover] = useState(false);

    const handleToggleLabel = (label) => {
        const currentLabels = note.labels || [];
        const newLabels = currentLabels.includes(label)
            ? currentLabels.filter(l => l !== label)
            : [...currentLabels, label];
        onUpdate(note._id, { labels: newLabels });
    };

    const handleAddNewLabel = async (label) => {
        await apiCreateLabel(label);
        handleToggleLabel(label);
    };

    const handleColorSelect = (color) => {
        onUpdate(note._id, { color });
        setShowColorPicker(false);
    };

    return (
        <div
            className={`keep-note-card ${note.color && note.color !== 'default' ? `color-${note.color}` : ''}`}
            onClick={() => !isTrash && onClick(note)}
        >
            <div className="card-selection-check"><Check size={16} /></div>

            <div className="card-header">
                <h3 className="card-title">{note.title}</h3>
                {!isTrash && (
                    <button
                        className={`pin-icon ${note.isPinned ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); onUpdate(note._id, { isPinned: !note.isPinned }); }}
                    >
                        <Pin size={18} />
                    </button>
                )}
            </div>

            <div className="card-content">
                {note.checklist && note.checklist.length > 0 ? (
                    <div className="card-checklist">
                        {note.checklist.map((item, idx) => (
                            <div key={idx} className="checklist-item" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        const newChecklist = [...note.checklist];
                                        newChecklist[idx].completed = !newChecklist[idx].completed;
                                        onUpdate(note._id, { checklist: newChecklist });
                                    }}
                                    className="checklist-checkbox"
                                />
                                <span className={`checklist-text ${item.completed ? 'completed' : ''}`}>
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>{note.description}</p>
                )}
            </div>

            {note.labels?.length > 0 && (
                <div className="card-labels">
                    {note.labels.map((label, idx) => (
                        <span key={idx} className="card-label-chip">{label}</span>
                    ))}
                </div>
            )}

            <div className="card-actions">
                {isTrash ? (
                    <>
                        <button title="Restore" onClick={(e) => { e.stopPropagation(); onRestore(note._id); }}><RotateCcw size={18} /></button>
                        <button title="Delete Forever" onClick={(e) => { e.stopPropagation(); onPermanentDelete(note._id); }}><XCircle size={18} /></button>
                    </>
                ) : (
                    <>
                        <button title="Remind me" onClick={(e) => e.stopPropagation()}><Bell size={18} /></button>
                        <button title="Collaborator" onClick={(e) => e.stopPropagation()}><UserPlus size={18} /></button>
                        <div style={{ position: 'relative' }} onMouseEnter={() => setShowColorPicker(true)} onMouseLeave={() => setShowColorPicker(false)}>
                            <button title="Background options" onClick={(e) => e.stopPropagation()}><Palette size={18} /></button>
                            {showColorPicker && (
                                <ColorPicker
                                    selectedColor={note.color}
                                    onSelect={handleColorSelect}
                                />
                            )}
                        </div>
                        <button title="Archive" onClick={(e) => { e.stopPropagation(); onUpdate(note._id, { isArchived: !note.isArchived }); }}><Archive size={18} /></button>
                        <button title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}><Trash2 size={18} /></button>
                        <div style={{ position: 'relative' }}>
                            <button title="More" onClick={(e) => { e.stopPropagation(); setShowLabelsPopover(!showLabelsPopover); }}><MoreVertical size={18} /></button>
                            {showLabelsPopover && (
                                <NoteLabelsPopover
                                    noteLabels={note.labels || []}
                                    onToggleLabel={handleToggleLabel}
                                    onAddNewLabel={handleAddNewLabel}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default withAnimation(NoteCard);
