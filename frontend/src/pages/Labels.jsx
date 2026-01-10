import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useLabels } from '../context/LabelContext';
import { renameLabel, deleteLabel } from '../services/api';
import { Trash2, Edit2, Check, X, Plus } from 'lucide-react';
import '../styles/Dashboard.css'; // Reusing layout styles

const Labels = () => {
    const { labels, refreshLabels } = useLabels();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [editingLabel, setEditingLabel] = useState(null); // { oldName, currentName }
    const [newLabelName, setNewLabelName] = useState('');

    const handleRename = async (oldName, newName) => {
        if (!newName.trim() || oldName === newName) {
            setEditingLabel(null);
            return;
        }
        try {
            const response = await renameLabel(oldName, newName);
            if (response.data.success) {
                refreshLabels();
                setEditingLabel(null);
            }
        } catch (err) {
            console.error("Failed to rename label", err);
        }
    };

    const handleDelete = async (labelName) => {
        if (!window.confirm(`Are you sure you want to delete the label "${labelName}"? It will be removed from all notes.`)) return;
        try {
            const response = await deleteLabel(labelName);
            if (response.data.success) {
                refreshLabels();
            }
        } catch (err) {
            console.error("Failed to delete label", err);
        }
    };

    return (
        <div className="keep-layout">
            <Navbar onSearch={() => { }} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="keep-main-content">
                <Sidebar isOpen={isSidebarOpen} />
                <main className="keep-notes-area">
                    <div className="labels-manager-container" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                        <h2 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Edit labels</h2>

                        <div className="label-list">
                            {labels.map((label, idx) => (
                                <div key={idx} className="label-edit-item" style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f3f4' }}>
                                    <button onClick={() => handleDelete(label)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#5f6368' }}>
                                        <Trash2 size={20} />
                                    </button>

                                    {editingLabel?.oldName === label ? (
                                        <>
                                            <input
                                                value={editingLabel.currentName}
                                                onChange={(e) => setEditingLabel({ ...editingLabel, currentName: e.target.value })}
                                                autoFocus
                                                style={{ flex: 1, border: 'none', borderBottom: '2px solid #4285f4', padding: '4px', outline: 'none', fontSize: '1rem' }}
                                            />
                                            <button onClick={() => handleRename(label, editingLabel.currentName)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#5f6368' }}>
                                                <Check size={20} />
                                            </button>
                                            <button onClick={() => setEditingLabel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#5f6368' }}>
                                                <X size={20} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ flex: 1, padding: '4px 8px', fontSize: '1rem' }}>{label}</span>
                                            <button onClick={() => setEditingLabel({ oldName: label, currentName: label })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#5f6368' }}>
                                                <Edit2 size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <button className="close-btn" style={{ padding: '8px 24px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, color: '#5f6368' }} onClick={() => window.history.back()}>Done</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Labels;
