import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/api';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        phoneNumber: '',
        address: ''
    });
    const [originalData, setOriginalData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }
        loadUserProfile();
    }, [navigate]);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const response = await auth.getProfile();
            setFormData(response.data);
            setOriginalData(response.data);
            setMessage({ text: '', type: '' });
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.error || 'Failed to load profile', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setMessage({ text: 'Saving changes...', type: 'info' });
            const response = await auth.updateProfile(formData);
            
            setFormData(response.data);
            setOriginalData(response.data);
            setIsEditing(false);
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            
            // Update local storage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({
                ...currentUser,
                username: response.data.username
            }));

            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.error || 'Failed to update profile', 
                type: 'error' 
            });
        }
    };

    const handleCancel = () => {
        setFormData(originalData); // Reset to original data
        setIsEditing(false);
        setMessage({ text: '', type: '' });
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-card">
                    <div className="loading">Loading profile...</div>
                </div>
            </div>
        );
    }

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>My Profile</h2>
                
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                                minLength={3}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                title="Email cannot be changed"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Enter your phone number"
                            pattern="[0-9]*"
                            title="Please enter only numbers"
                        />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Enter your address"
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Tell us about yourself..."
                            rows="4"
                        />
                    </div>

                    <div className="button-group">
                        {!isEditing ? (
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(true)}
                                className="btn-edit"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button 
                                    type="submit" 
                                    className="btn-save"
                                    disabled={!hasChanges}
                                >
                                    Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleCancel}
                                    className="btn-cancel"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
