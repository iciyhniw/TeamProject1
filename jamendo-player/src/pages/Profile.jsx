import React, { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h1>Profile</h1>
          </div>
          <div className="profile-content">
            <div className="profile-info">
              <h2>User Information</h2>
              <p><strong>Name:</strong> {user.displayName || 'Не вказано'}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="profile-actions">
              <button className="profile-button">Edit Profile</button>
              <button className="profile-button">Change Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
