// src/features/profiles/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProfileData,
    profileSelection,
    updateProfileData,
} from "./profiles";
import ProfileForm from "./ProfileForm";
import "../../styles/components.css";
import EventList from "../eventFeature/EventList";

export default function ProfilePage() {
    const dispatch = useDispatch();

    const profiles = useSelector((state) => state.profiles.list);
    const loading = useSelector((state) => state.profiles.loading);

    const [selectedUser, setSelectedUser] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Load profiles on mount
    useEffect(() => {
        dispatch(fetchProfileData());
    }, [dispatch]);
    useEffect(() => {
        // Auto-select first profile if none is selected and profiles are loaded
        if (profiles.length > 0 && !selectedUser) {
            const firstProfileId = profiles[0]._id;
            setSelectedUser(firstProfileId);
            dispatch(profileSelection(firstProfileId));
            console.log("Auto-selected first profile:", profiles[0].name);
        }
    }, [profiles, selectedUser, dispatch]);


    // Get current user data - recalculated on every render
    const currentUserData = profiles.find(p => p._id === selectedUser);

    const handleUserChange = (e) => {
        const userId = e.target.value;
        setSelectedUser(userId);
        dispatch(profileSelection(userId));
        setShowSuccess(false);
    };

    const handleTimezoneChange = async (e) => {
        const newTimezone = e.target.value;

        if (!selectedUser) {
            alert("Please select a user");
            return;
        }

        setIsUpdating(true);
        setShowSuccess(false);
        // Failsafe: reset isUpdating after 5 seconds no matter what
        const failsafeTimeout = setTimeout(() => {
            console.log("Could not Refresh the data");
            setIsUpdating(false);
            alert("Kindly refresh the data with refresh button")
        }, 5000);
        try {
            // Step 1: Update on backend
            await dispatch(updateProfileData({
                id: selectedUser,
                timezone: newTimezone
            })).unwrap();

            console.log("Backend updated successfully");

            // Step 2: Fetch fresh data from backend
            await dispatch(fetchProfileData()).unwrap();

            console.log("Data refreshed from backend");
            // Clear failsafe
            clearTimeout(failsafeTimeout);

            // Step 3: Show success
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

        } catch (error) {
            console.error("Error updating timezone:", error);
            alert("Failed to update timezone. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const RefreshMode = async () => {
        setIsUpdating(true);
        try {
            await dispatch(fetchProfileData()).unwrap();
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error("Error refreshing:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <div className="page-profile">
                <ProfileForm />

                <div className="page-user">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20
                    }}>
                        <h3 style={{ margin: 0 }}>Available Users</h3>
                        <button
                            onClick={RefreshMode}
                            disabled={isUpdating}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: isUpdating ? '#95a5a6' : '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                cursor: isUpdating ? 'not-allowed' : 'pointer',
                                fontSize: 14,
                                fontWeight: 500,
                                transition: 'background-color 0.3s ease'
                            }}
                        >
                            {isUpdating ? '🔄 Refreshing...' : '🔄 Refresh'}
                        </button>
                    </div>

                    {loading && profiles.length === 0 ? (
                        <p>Loading profiles...</p>
                    ) : (
                        <div className="profile-list">
                            <label htmlFor="user-select">Select User</label>
                            <select
                                id="user-select"
                                value={selectedUser}
                                onChange={handleUserChange}
                                className="select-user"
                                disabled={isUpdating}
                            >
                                <option value="">-- Choose a user --</option>
                                {profiles.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.name} ({p.timezone})
                                    </option>
                                ))}
                            </select>

                            {showSuccess && (
                                <div style={{
                                    marginTop: 10,
                                    padding: 10,
                                    backgroundColor: '#d4edda',
                                    border: '1px solid #c3e6cb',
                                    borderRadius: 4,
                                    color: '#155724',
                                    fontSize: 14,
                                    textAlign: 'center'
                                }}>
                                    ✓ Timezone updated successfully!
                                </div>
                            )}

                            {currentUserData ? (
                                <div style={{ marginTop: 20 }}>
                                    <label>Change Timezone</label>
                                    <select
                                        className="select-user"
                                        value={currentUserData.timezone || "UTC"}
                                        onChange={handleTimezoneChange}
                                        style={{ marginTop: 8 }}
                                        disabled={isUpdating}
                                    >
                                        <option value="UTC">UTC</option>
                                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                                        <option value="America/New_York">America/New_York</option>
                                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                                        <option value="Europe/London">Europe/London</option>
                                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                                        <option value="Australia/Sydney">Australia/Sydney</option>
                                    </select>

                                    {isUpdating && (
                                        <div style={{
                                            marginTop: 10,
                                            padding: 8,
                                            backgroundColor: '#fff3cd',
                                            border: '1px solid #ffeeba',
                                            borderRadius: 4,
                                            color: '#856404',
                                            fontSize: 13,
                                            textAlign: 'center'
                                        }}>
                                            ⏳ Updating timezone...
                                        </div>
                                    )}

                                    <div style={{
                                        marginTop: 15,
                                        padding: 12,
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: 4,
                                        border: '1px solid #ddd'
                                    }}>
                                        <div><strong>Current Timezone:</strong> {currentUserData.timezone || 'UTC'}</div>
                                        <small style={{ color: '#666' }}>
                                            All your events will be shown in this timezone
                                        </small>
                                    </div>
                                </div>
                            ) : selectedUser === "" ? (
                                <p style={{ marginTop: 15, color: '#666' }}>
                                    Please select a user to view and manage their timezone settings.
                                </p>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
            <EventList />
        </>

    );
}