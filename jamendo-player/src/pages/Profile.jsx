import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import '../styles/Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setFormData(prev => ({ ...prev, displayName: user.displayName || '' }));
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await updateProfile(auth.currentUser, {
                displayName: formData.displayName
            });
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            setError('Failed to update profile: ' + error.message);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                formData.currentPassword
            );
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, formData.newPassword);
            setSuccess('Password updated successfully!');
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            setError('Failed to update password: ' + error.message);
        }
    };

    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <h1>Profile</h1>
                    </div>
                    <div className="profile-content">
                        <div className="profile-info">
                            <div className="profile-avatar">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            
                            {!isEditing ? (
                                <>
                                    <h2>{user.displayName || 'User'}</h2>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Member Since:</strong> {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
                                    <button 
                                        className="profile-button edit-button"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </button>
                                </>
                            ) : (
                                <form onSubmit={handleProfileUpdate} className="profile-form">
                                    <div className="form-group">
                                        <label>Display Name:</label>
                                        <input
                                            type="text"
                                            name="displayName"
                                            value={formData.displayName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="button-group">
                                        <button type="submit" className="profile-button save-button">Save Changes</button>
                                        <button 
                                            type="button" 
                                            className="profile-button cancel-button"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            <form onSubmit={handlePasswordChange} className="password-form">
                                <h3>Change Password</h3>
                                <div className="form-group">
                                    <label>Current Password:</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Password:</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password:</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="profile-button">Update Password</button>
                            </form>

                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;