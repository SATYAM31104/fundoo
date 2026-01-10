import React, { useState, useRef, useEffect } from 'react';
import { SquareCheck, Image as ImageIcon, Paintbrush, Bell, UserPlus, Palette, Archive, MoreVertical, Pin, Plus, X, List } from 'lucide-react';
import { createLabel as apiCreateLabel } from '../services/api';
import NoteLabelsPopover from './NoteLabelsPopover';
import ColorPicker from './ColorPicker';
import '../styles/CreateNote.css';

const CreateNote = ({ onCreate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isChecklist, setIsChecklist] = useState(false);
    const [note, setNote] = useState({
        title: '',
        description: '',
        labels: [],
        checklist: [],
        color: 'default',
        isPinned: false
    });
    const [showLabelsPopover, setShowLabelsPopover] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [note, isChecklist, showColorPicker, showLabelsPopover]);

    const handleClose = () => {
        if (note.title || note.description || (isChecklist && note.checklist.length > 0)) {
            onCreate(note);
            setNote({ title: '', description: '', labels: [], checklist: [], color: 'default', isPinned: false });
            setIsChecklist(false);
            setShowColorPicker(false);
            setShowLabelsPopover(false);
        }
        setIsExpanded(false);
    };

    const addChecklistItem = () => {
        setNote({
            ...note,
            checklist: [...note.checklist, { text: '', completed: false }]
        });
    };

    const updateChecklistItem = (index, value) => {
        const newChecklist = [...note.checklist];
        newChecklist[index].text = value;
        setNote({ ...note, checklist: newChecklist });
    };

    const toggleChecklistItem = (index) => {
        const newChecklist = [...note.checklist];
        newChecklist[index].completed = !newChecklist[index].completed;
        setNote({ ...note, checklist: newChecklist });
    };

    const removeChecklistItem = (index) => {
        const newChecklist = note.checklist.filter((_, i) => i !== index);
        setNote({ ...note, checklist: newChecklist });
    };

    const handleToggleLabel = (label) => {
        const currentLabels = note.labels || [];
        const newLabels = currentLabels.includes(label)
            ? currentLabels.filter(l => l !== label)
            : [...currentLabels, label];
        setNote({ ...note, labels: newLabels });
    };

    const handleAddNewLabel = async (label) => {
        await apiCreateLabel(label);
        handleToggleLabel(label);
    };

    const removeLabel = (labelToRemove) => {
        setNote({
            ...note,
            labels: note.labels.filter(label => label !== labelToRemove)
        });
    };

    return (
        <div className={`keep-create-note ${isExpanded ? 'expanded' : ''}`} ref={containerRef}>
            <div className={`create-card keep-shadow ${note.color && note.color !== 'default' ? `color-${note.color}` : ''}`}>
                {!isExpanded ? (
                    <div className="collapsed-view" onClick={() => setIsExpanded(true)}>
                        <span className="placeholder">Take a note...</span>
                        <div className="collapsed-actions">
                            <button onClick={(e) => { e.stopPropagation(); setIsChecklist(true); setIsExpanded(true); if (!note.checklist.length) addChecklistItem(); }}><SquareCheck size={20} /></button>
                            <button><Paintbrush size={20} /></button>
                            <button><ImageIcon size={20} /></button>
                        </div>
                    </div>
                ) : (
                    <div className="expanded-view">
                        <div className="create-header">
                            <input
                                placeholder="Title"
                                value={note.title}
                                className="title-input"
                                onChange={(e) => setNote({ ...note, title: e.target.value })}
                            />
                            <button
                                className={`pin-btn ${note.isPinned ? 'active' : ''}`}
                                onClick={() => setNote({ ...note, isPinned: !note.isPinned })}
                            >
                                <Pin size={20} />
                            </button>
                        </div>

                        {isChecklist ? (
                            <div className="checklist-container">
                                {note.checklist.map((item, index) => (
                                    <div key={index} className="checklist-input-item">
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            onChange={() => toggleChecklistItem(index)}
                                        />
                                        <input
                                            placeholder="List item"
                                            value={item.text}
                                            autoFocus={index === note.checklist.length - 1}
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
                                autoFocus
                                value={note.description}
                                onChange={(e) => setNote({ ...note, description: e.target.value })}
                                rows={1}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                            />
                        )}

                        {note.labels.length > 0 && (
                            <div className="create-note-labels">
                                {note.labels.map((label, idx) => (
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
                                    <button
                                        title="Background options"
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                    >
                                        <Palette size={18} />
                                    </button>
                                    {showColorPicker && (
                                        <ColorPicker
                                            selectedColor={note.color}
                                            onSelect={(color) => {
                                                setNote({ ...note, color });
                                                setShowColorPicker(false);
                                            }}
                                        />
                                    )}
                                </div>
                                <button title="Add image"><ImageIcon size={18} /></button>
                                <button
                                    title="Archive"
                                    onClick={() => {
                                        onCreate({ ...note, isArchived: true });
                                        setNote({ title: '', description: '', labels: [], checklist: [], color: 'default', isPinned: false });
                                        setIsExpanded(false);
                                    }}
                                >
                                    <Archive size={18} />
                                </button>
                                <div style={{ position: 'relative' }}>
                                    <button
                                        title="Add Label"
                                        onClick={() => setShowLabelsPopover(!showLabelsPopover)}
                                        className={showLabelsPopover ? 'active' : ''}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    {showLabelsPopover && (
                                        <NoteLabelsPopover
                                            noteLabels={note.labels || []}
                                            onToggleLabel={handleToggleLabel}
                                            onAddNewLabel={handleAddNewLabel}
                                        />
                                    )}
                                </div>
                                <button
                                    title="Toggle Checklist"
                                    onClick={() => setIsChecklist(!isChecklist)}
                                    className={isChecklist ? 'active' : ''}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                            <button className="close-btn" onClick={handleClose}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateNote;
