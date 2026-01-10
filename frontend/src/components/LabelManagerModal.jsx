import React, { useState } from 'react';
import { X, Plus, Check, Edit2, Trash2 } from 'lucide-react';
import { useLabels } from '../context/LabelContext';
import { createLabel, renameLabel, deleteLabel } from '../services/api';
import './LabelManagerModal.css';

const LabelManagerModal = ({ isOpen, onClose }) => {
    const { labels, refreshLabels } = useLabels();
    const [newLabel, setNewLabel] = useState('');
    const [editingLabel, setEditingLabel] = useState(null); // { oldName, currentName }

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!newLabel.trim()) return;
        try {
            await createLabel(newLabel.trim());
            setNewLabel('');
            refreshLabels();
        } catch (err) {
            console.error("Failed to create label", err);
        }
    };

    const handleRename = async (oldName, newName) => {
        if (!newName.trim() || oldName === newName) {
            setEditingLabel(null);
            return;
        }
        try {
            await renameLabel(oldName, newName);
            setEditingLabel(null);
            refreshLabels();
        } catch (err) {
            console.error("Failed to rename label", err);
        }
    };

    const handleDelete = async (labelName) => {
        try {
            await deleteLabel(labelName);
            refreshLabels();
        } catch (err) {
            console.error("Failed to delete label", err);
        }
    };

    return (
        <div className="label-modal-overlay" onClick={onClose}>
            <div className="label-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="label-modal-header">
                    <h3>Edit labels</h3>
                </div>

                <div className="label-create-section">
                    <button className="icon-btn" onClick={() => setNewLabel('')}><X size={20} /></button>
                    <input
                        placeholder="Create new label"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    />
                    <button className="icon-btn" onClick={handleCreate}><Plus size={20} /></button>
                </div>

                <div className="label-list-scroll">
                    {labels.map((label, idx) => (
                        <div key={idx} className="label-manage-item">
                            <button className="icon-btn delete-btn" onClick={() => handleDelete(label)}>
                                <Trash2 size={18} />
                            </button>

                            {editingLabel?.oldName === label ? (
                                <>
                                    <input
                                        value={editingLabel.currentName}
                                        autoFocus
                                        onChange={(e) => setEditingLabel({ ...editingLabel, currentName: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRename(label, editingLabel.currentName)}
                                    />
                                    <button className="icon-btn" onClick={() => handleRename(label, editingLabel.currentName)}>
                                        <Check size={18} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="label-name">{label}</span>
                                    <button className="icon-btn" onClick={() => setEditingLabel({ oldName: label, currentName: label })}>
                                        <Edit2 size={18} />
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="label-modal-footer">
                    <button className="done-btn" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
};

export default LabelManagerModal;
