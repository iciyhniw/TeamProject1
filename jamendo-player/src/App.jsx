import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import './styles/CommonFile.css'
import Profile from "./pages/Profile";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path= "/Profile" element={<Profile />} />
    </Routes>
  </Router>
);

export default App;
