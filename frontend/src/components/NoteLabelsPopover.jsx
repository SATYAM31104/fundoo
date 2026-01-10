import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useLabels } from '../context/LabelContext';
import './NoteLabelsPopover.css';

const NoteLabelsPopover = ({ noteLabels, onToggleLabel, onAddNewLabel }) => {
    const { labels } = useLabels();
    const [search, setSearch] = useState('');

    const filteredLabels = labels.filter(l => l.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="note-labels-popover" onClick={(e) => e.stopPropagation()}>
            <div className="popover-title">Label note</div>
            <div className="popover-search">
                <input
                    placeholder="Enter label name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                />
                <Search size={14} className="search-icon" />
            </div>
            <div className="popover-list">
                {filteredLabels.map((label, idx) => (
                    <label key={idx} className="label-select-item">
                        <input
                            type="checkbox"
                            checked={noteLabels.includes(label)}
                            onChange={() => onToggleLabel(label)}
                        />
                        <span className="label-text">{label}</span>
                    </label>
                ))}
            </div>
            {search && !labels.includes(search) && (
                <div className="popover-create" onClick={() => onAddNewLabel(search)}>
                    <Plus size={16} />
                    <span>Create "<strong>{search}</strong>"</span>
                </div>
            )}
        </div>
    );
};

export default NoteLabelsPopover;
