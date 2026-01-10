import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Menu, RefreshCw, Grid, Settings, User } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = ({ onSearch, toggleSidebar }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="keep-navbar">
            <div className="nav-section left">
                <button className="icon-button menu-btn" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <div className="keep-logo">
                    <img src="https://www.gstatic.com/images/branding/product/2x/keep_2020q4_48dp.png" alt="Fundoo" width="40" />
                    <span>Fundoo</span>
                </div>
            </div>

            <div className="nav-section center">
                <div className="keep-search-container">
                    <button className="search-btn"><Search size={20} /></button>
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="nav-section right">
                <button className="icon-button"><RefreshCw size={20} /></button>
                <button className="icon-button"><Grid size={20} /></button>
                <button className="icon-button"><Settings size={20} /></button>
                <div className="user-profile-circle" onClick={logout} title="Logout">
                    {user?.name?.[0] || 'U'}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
