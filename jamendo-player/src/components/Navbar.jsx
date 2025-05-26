import React, { useContext } from 'react'; // 🟢 Додай useContext сюди
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../components/AuthContext';

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleFocus = () => {
    navigate('/search');
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="nav-links">
        <Link to="/">Home</Link>
      </div>
      <input
        type="text"
        placeholder="Search music..."
        onChange={(e) => onSearch?.(e.target.value)}
        onFocus={handleFocus}
      />
      <div className="nav-links nav-links-right">
        {user && <Link to="/profile">Profile</Link>}
        {user ? (
          <button onClick={handleSignOut} className="nav-link-button">Вихід</button>
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