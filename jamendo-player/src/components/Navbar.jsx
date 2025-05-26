import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = ({ onSearch, user }) => {
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
                {user ? (
                    <button onClick={() => signOut(auth)} className="nav-link-button">Вихід</button>
                ) : (
                    <>
                        <Link to="/login" className="nav-link-button">Увійти</Link>
                        <Link to="/register" className="nav-link-button">Реєстрація</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;