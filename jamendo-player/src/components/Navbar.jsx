import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = ({ onSearch }) => {
    const navigate = useNavigate();

    const handleFocus = () => {
        navigate('/search');
    };

    return (
        <div className="navbar">
            <div className="nav-links">
                <Link to="/">Home</Link>
            </div>
            <input
                type="text"
                placeholder="Search music..."
                onChange={(e) => onSearch && onSearch(e.target.value)}
                onFocus={handleFocus}
            />
            <div className="nav-links nav-links-right">
                <Link to="/profile">Profile</Link>
            </div>
        </div>
    );
};

export default Navbar;