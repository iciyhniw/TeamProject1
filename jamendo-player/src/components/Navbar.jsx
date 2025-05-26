import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = ({ user }) => {
    return (
        <div className="navbar">
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/library">Library</Link>
                <Link to="/search">Search</Link>
            </div>
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