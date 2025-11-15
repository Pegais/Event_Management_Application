import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createEventData } from "./Events";
import { fetchProfileData } from "../profileFeature/profiles";

export default function EventForm() {
    const dispatch = useDispatch();
    const profiles = useSelector((state) => state.profiles.list);
    const loading = useSelector((state) => state.events?.loading);

    console.log("Event Form triggered");
    console.log("Event Form :", profiles);

    const [form, setForm] = useState({
        title: "",
        description: "",
        profiles: [],
        eventTimezone: "UTC",
        start: "",
        end: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Load profiles when component mounts
    useEffect(() => {
        if (profiles.length === 0) {
            dispatch(fetchProfileData());
        }
    }, [dispatch, profiles.length]);

    const changeProfile = (id) => {
        setForm((prev) => ({
            ...prev,
            profiles: prev.profiles.includes(id)
                ? prev.profiles.filter((p) => p !== id)
                : [...prev.profiles, id],
        }));
        setErrorMessage(""); // Clear error when user makes changes
    };

    const validateForm = () => {
        // Check if at least one profile is selected
        if (form.profiles.length === 0) {
            setErrorMessage("Please select at least one profile");
            return false;
        }

        // Check if start and end dates are provided
        if (!form.start || !form.end) {
            setErrorMessage("Please provide both start and end date/time");
            return false;
        }

        // Check if end date is after start date
        const startDate = new Date(form.start);
        const endDate = new Date(form.end);

        if (endDate <= startDate) {
            setErrorMessage("End date/time must be after start date/time");
            return false;
        }

        // Check if start date is not in the past
        const now = new Date();
        if (startDate < now) {
            setErrorMessage("Start date/time cannot be in the past");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await dispatch(createEventData(form)).unwrap();
            
            console.log("Event created successfully!");
            
            // Show success message
            setShowSuccess(true);
            
            // Reset form
            setForm({
                title: "",
                description: "",
                profiles: [],
                eventTimezone: "UTC",
                start: "",
                end: ""
            });

            // Hide success message after 3 seconds
            setTimeout(() => setShowSuccess(false), 3000);

        } catch (error) {
            console.error("Error creating event:", error);
            setErrorMessage("Failed to create event. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className='form-events' onSubmit={handleSubmit}>
            <h3>Create Event</h3>

            {/* Success Message */}
            {showSuccess && (
                <div style={{
                    padding: 10,
                    backgroundColor: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: 4,
                    color: '#155724',
                    fontSize: 14,
                    marginBottom: 15,
                    textAlign: 'center'
                }}>
                    ✓ Event created successfully!
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div style={{
                    padding: 10,
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: 4,
                    color: '#721c24',
                    fontSize: 14,
                    marginBottom: 15,
                    textAlign: 'center'
                }}>
                    ⚠️ {errorMessage}
                </div>
            )}

            <label className='form-label'>Title *</label>
            <input
            
                 style={{height:"40px",border:"none",borderRadius:"5px"}}
                value={form.title}
                onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    setErrorMessage("");
                }}
                placeholder="Enter event title"
                disabled={isSubmitting}
                required
            />

            <label className='form-label'>Description</label>
            <textarea
            className='form-input'
                value={form.description}
                onChange={(e) => {
                    setForm({ ...form, description: e.target.value });
                    setErrorMessage("");
                }}
                placeholder="Enter event description (optional)"
                rows={3}
                disabled={isSubmitting}
            />

            <label className='form-label'>
                Assign Profiles * 
                <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>
                    ({form.profiles.length} selected)
                </span>
            </label>
            <div className='profile-tags'>
                {profiles.length === 0 ? (
                    <p style={{ color: '#666', fontSize: 14, margin: 0 }}>
                        No profiles available. Please create a profile first.
                    </p>
                ) : (
                    profiles.map((p) => {
                        const isSelected =form.profiles.includes(p._id)
                        return (
                            <div 
                                key={p._id}
                                className={`tag ${form.profiles.includes(p._id) ? "active" : ""}`}
                                onClick={() => !isSubmitting && changeProfile(p._id)}
                                   style={{
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    opacity: isSubmitting ? 0.6 : 1,
                                    backgroundColor: isSelected ? '#4CAF50' : '#e0e0e0',
                                    color: isSelected ? 'white' : '#333',
                                    border: isSelected ? '2px solid #45a049' : '1px solid #ccc',
                                    fontWeight: isSelected ? 'bold' : 'normal',
                                    transition: 'all 0.3s ease',
                                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: isSelected ? '0 2px 8px rgba(76, 175, 80, 0.3)' : 'none'
                                }}
                            >
                                {p.name}
                            </div>
                        );
                    })
                )}
            </div>

            <label className='form-label'>Event Timezone *</label>
            <select
            className='form-input'
                value={form.eventTimezone}
                onChange={(e) => {
                    setForm({ ...form, eventTimezone: e.target.value });
                    setErrorMessage("");
                }}
                disabled={isSubmitting}
            >
                <option value="UTC">UTC</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                <option value="Australia/Sydney">Australia/Sydney (AEDT)</option>
            </select>

            <label className='form-label'>Start Date & Time *</label>
            <input
            className='form-input'
                type="datetime-local"
                value={form.start}
                onChange={(e) => {
                    setForm({ ...form, start: e.target.value });
                    setErrorMessage("");
                }}
                disabled={isSubmitting}
                required
            />

            <label className='form-label'>End Date & Time *</label>
            <input
            className='form-input'
                type="datetime-local"
                value={form.end}
                onChange={(e) => {
                    setForm({ ...form, end: e.target.value });
                    setErrorMessage("");
                }}
                min={form.start} // End must be after start
                disabled={isSubmitting}
                required
            />

            {/* Info box */}
            <div style={{
                padding: 10,
                backgroundColor: '#e7f3ff',
                border: '1px solid #b3d9ff',
                borderRadius: 4,
                fontSize: 12,
                color: '#004085',
                marginTop: 10
            }}>
                💡 <strong>Note:</strong> Event will be created in {form.eventTimezone} timezone
                {form.profiles.length > 0 && ` and assigned to ${form.profiles.length} profile(s)`}
            </div>

            <button 
                className='btn' 
                type="submit"
                disabled={isSubmitting || profiles.length === 0}
                style={{
                    opacity: (isSubmitting || profiles.length === 0) ? 0.6 : 1,
                    cursor: (isSubmitting || profiles.length === 0) ? 'not-allowed' : 'pointer'
                }}
            >
                {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </button>
        </form>
    );
}