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
            </div>
            <div className="auth-section">
                {user ? (
                    <>
                        <button onClick={() => signOut(auth)} className="logout-button">Вихід</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="auth-button login">Увійти</Link>
                        <Link to="/register" className="auth-button register">Реєстрація</Link>
                    </>
                )}
            </div>
        </div>

    );
};

export default Navbar;