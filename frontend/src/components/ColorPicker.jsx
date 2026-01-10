import React from 'react';
import { Check } from 'lucide-react';
import './ColorPicker.css';

const colors = [
    { name: 'default', color: 'var(--color-default)', label: 'Default' },
    { name: 'red', color: 'var(--color-red)', label: 'Red' },
    { name: 'orange', color: 'var(--color-orange)', label: 'Orange' },
    { name: 'yellow', color: 'var(--color-yellow)', label: 'Yellow' },
    { name: 'green', color: 'var(--color-green)', label: 'Green' },
    { name: 'teal', color: 'var(--color-teal)', label: 'Teal' },
    { name: 'blue', color: 'var(--color-blue)', label: 'Blue' },
    { name: 'dark-blue', color: 'var(--color-dark-blue)', label: 'Dark blue' },
    { name: 'purple', color: 'var(--color-purple)', label: 'Purple' },
    { name: 'pink', color: 'var(--color-pink)', label: 'Pink' },
    { name: 'brown', color: 'var(--color-brown)', label: 'Brown' },
    { name: 'grey', color: 'var(--color-grey)', label: 'Grey' },
];

const ColorPicker = ({ onSelect, selectedColor }) => {
    return (
        <div className="color-picker-dropdown">
            {colors.map((c) => (
                <button
                    key={c.name}
                    className="color-option"
                    style={{ backgroundColor: c.color }}
                    title={c.label}
                    onClick={() => onSelect(c.name)}
                >
                    {(selectedColor === c.name || (!selectedColor && c.name === 'default')) && (
                        <Check size={14} color="#5f6368" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default ColorPicker;
