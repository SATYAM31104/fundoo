import React from 'react';
import { NavLink } from 'react-router-dom';
import { Lightbulb, Bell, Tag, Archive, Trash2, Edit2 } from 'lucide-react';
import { useLabels } from '../context/LabelContext';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen }) => {
    const { labels, setLabelModalOpen } = useLabels();
    const [isHovered, setIsHovered] = React.useState(false);

    const actualOpen = isOpen || isHovered;

    const menuItems = [
        { icon: <Lightbulb size={24} />, label: 'Notes', path: '/' },
        { icon: <Bell size={24} />, label: 'Reminders', path: '/reminders' },
        ...labels.map(label => ({
            icon: <Tag size={24} />,
            label: label,
            path: `/label/${label}`
        })),
        { icon: <Edit2 size={24} />, label: 'Edit labels', path: '/labels' },
        { icon: <Archive size={24} />, label: 'Archive', path: '/archive' },
        { icon: <Trash2 size={24} />, label: 'Trash', path: '/trash' },
    ];

    return (
        <aside
            className={`keep-sidebar ${actualOpen ? 'open' : 'closed'}`}
            onMouseEnter={() => !isOpen && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="sidebar-items">
                {menuItems.map((item, index) => {
                    const isEditLabels = item.label === 'Edit labels';
                    return (
                        <NavLink
                            key={index}
                            to={isEditLabels ? '#' : item.path}
                            className={({ isActive }) => `keep-menu-item ${isActive && !isEditLabels ? 'active' : ''}`}
                            onClick={(e) => {
                                if (isEditLabels) {
                                    e.preventDefault();
                                    setLabelModalOpen(true);
                                }
                            }}
                        >
                            <div className="item-icon">{item.icon}</div>
                            <span className="item-label">{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </aside>
    );
};

export default Sidebar;
