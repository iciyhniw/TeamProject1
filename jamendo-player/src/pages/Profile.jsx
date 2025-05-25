import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


const Profile = () => {
    const navigate = useNavigate();

    const handleSearch = async (query) => {
        if (query.trim()) {
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }
    };

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
                            <p><strong>Name:</strong> John Doe</p>
                            <p><strong>Email:</strong> john.doe@example.com</p>
                            <p><strong>Member Since:</strong> January 2025</p>
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