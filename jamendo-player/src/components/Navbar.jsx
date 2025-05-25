import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = ({ onSearch }) => (
    <div className="navbar">
        <div className="nav-links">
            <Link to="/">Home</Link>
        </div>
        <input
            type="text"
            placeholder="Search music..."
            onChange={(e) => onSearch(e.target.value)}
        />
        <div className="nav-links nav-links-right">
            <Link to="/profile">Profile</Link>
        </div>
    </div>
);

export default Navbar;