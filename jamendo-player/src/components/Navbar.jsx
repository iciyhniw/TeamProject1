import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = ({ onSearch }) => (
  <div className="navbar">
    <input
      type="text"
      placeholder="Search music..."
      onChange={(e) => onSearch(e.target.value)}
    />
    <div className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/search">Search</Link>
    </div>
  </div>
);

export default Navbar;
