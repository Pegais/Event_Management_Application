import { useState, useEffect } from "react";
import { utcToLocal } from "../../utils/timezone";
import { useSelector, useDispatch } from "react-redux";
import { updateEventData, fetchEventData, fetchEventLogs } from "./Events";
import "./../../styles/components.css";

export default function EventCard({ event }) {
  console.log("THESE ARE THE EVENTS :", event);
  
  const dispatch = useDispatch();
  const selected = useSelector((s) => s.profiles.selectedId);
  const profiles = useSelector((s) => s.profiles.list);
  const eventLogs = useSelector((s) => s.events.logs[event._id] || []);
  const viewer = profiles.find((p) => p._id === selected);

  const [isEditing, setIsEditing] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    title: event.title,
    description: event.description,
    start: "",
    end: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const viewerTz = viewer?.timezone || "UTC";

  // Fetch logs when logs panel is opened
  useEffect(() => {
    if (showLogs && eventLogs.length === 0) {
      setLogsLoading(true);
      dispatch(fetchEventLogs(event._id))
        .finally(() => setLogsLoading(false));
    }
  }, [showLogs, event._id, dispatch]);

  // Get profile names from populated profiles or IDs
  const getProfileNames = () => {
    if (!event.profiles || event.profiles.length === 0) return [];
    
    if (event.profiles[0]?.name) {
      return event.profiles.map(p => ({
        id: p._id,
        name: p.name
      }));
    }
    
    return event.profiles
      .map(profileId => {
        const profile = profiles.find(p => p._id === profileId);
        return profile ? { id: profile._id, name: profile.name } : null;
      })
      .filter(Boolean);
  };

  const assignedProfiles = getProfileNames();

  // Check if current viewer is assigned to this event
  const isAssignedToViewer = event.profiles.some(p => {
    const profileId = typeof p === 'string' ? p : p._id;
    return profileId === selected;
  });

  // Format change value based on field type
  const formatChangeValue = (field, value) => {
    if (field === 'startUTC' || field === 'endUTC') {
      return utcToLocal(value, viewerTz);
    }
    if (!value || value === 'None' || value === '') {
      return '(empty)';
    }
    return value;
  };

  // Get field display name
  const getFieldLabel = (field) => {
    const labels = {
      title: 'Title',
      description: 'Description',
      startUTC: 'Start Time',
      endUTC: 'End Time',
      eventTimezone: 'Event Timezone'
    };
    return labels[field] || field;
  };

  const handleEdit = () => {
    setIsEditing(true);
    
    const startLocal = event.start ? new Date(event.start).toISOString().slice(0, 16) : "";
    const endLocal = event.end ? new Date(event.end).toISOString().slice(0, 16) : "";
    
    setEditForm({
      title: event.title,
      description: event.description,
      start: startLocal,
      end: endLocal,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!editForm.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!selected) {
      alert("Please select a profile first");
      return;
    }

    if (editForm.start && editForm.end) {
      const startDate = new Date(editForm.start);
      const endDate = new Date(editForm.end);
      
      if (endDate <= startDate) {
        alert("End date/time must be after start date/time");
        return;
      }

      const now = new Date();
      if (startDate < now) {
        alert("Start date/time cannot be in the past");
        return;
      }
    }

    setIsUpdating(true);

    try {
      await dispatch(updateEventData({
        id: event._id,
        data: {
          title: editForm.title,
          description: editForm.description,
          start: editForm.start || event.start,
          end: editForm.end || event.end,
          modifiedBy: selected
        }
      })).unwrap();

      console.log("Event updated successfully!");
      
      // Refresh events and logs
      await dispatch(fetchEventData(selected)).unwrap();
      await dispatch(fetchEventLogs(event._id)).unwrap();
      
      setShowSuccess(true);
      setIsEditing(false);

      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleLogs = () => {
    setShowLogs(!showLogs);
  };

  return (
    <div className="event-card">
      {showSuccess && (
        <div style={{
          padding: 8,
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: 4,
          color: '#155724',
          fontSize: 13,
          marginBottom: 10,
          textAlign: 'center'
        }}>
          ✓ Event updated successfully!
        </div>
      )}

      {!isEditing ? (
        <>
          {/* View Mode */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
            <h4 style={{ margin: 0 }}>{event.title}</h4>
            {isAssignedToViewer && (
              <button
                onClick={handleEdit}
                style={{
                  padding: '5px 12px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 500
                }}
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {event.description && (
            <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: 14 }}>
              {event.description}
            </p>
          )}

          <div className="time-row" style={{ marginBottom: 8 }}>
            <span style={{ color: '#666', fontSize: 13 }}>Start:</span>
            <strong style={{ fontSize: 14 }}>
              {event.startUTC ? utcToLocal(event.startUTC, viewerTz) : 'N/A'}
            </strong>
          </div>

          <div className="time-row" style={{ marginBottom: 8 }}>
            <span style={{ color: '#666', fontSize: 13 }}>End:</span>
            <strong style={{ fontSize: 14 }}>
              {event.endUTC ? utcToLocal(event.endUTC, viewerTz) : 'N/A'}
            </strong>
          </div>

          {/* Display timezone info */}
          <div style={{ 
            marginTop: 10,
            marginBottom: 10,
            fontSize: 11, 
            color: '#999',
            fontStyle: 'italic'
          }}>
            📍 Viewing in: {viewerTz}
          </div>

          {/* Display assigned profiles */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #eee' }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6, fontWeight: 500 }}>
              Assigned to:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {assignedProfiles.length > 0 ? (
                assignedProfiles.map((profile) => (
                  <span
                    key={profile.id}
                    style={{
                      backgroundColor: profile.id === selected ? '#4CAF50' : '#e3f2fd',
                      color: profile.id === selected ? 'white' : '#1976d2',
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: profile.id === selected ? 'bold' : '500'
                    }}
                  >
                    {profile.id === selected && '👤 '}
                    {profile.name}
                  </span>
                ))
              ) : (
                <small style={{ color: '#999' }}>No profiles assigned</small>
              )}
            </div>
          </div>

          {/* Timestamps */}
          {(event.createdAt || event.updatedAt) && (
            <div style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: '1px solid #eee',
              fontSize: 11,
              color: '#999'
            }}>
              {event.createdAt && (
                <div>📅 Created: {utcToLocal(event.createdAt, viewerTz)}</div>
              )}
              {event.updatedAt && event.updatedAt !== event.createdAt && (
                <div>🔄 Last updated: {utcToLocal(event.updatedAt, viewerTz)}</div>
              )}
            </div>
          )}

          {/* Update Logs Button */}
          <div style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px solid #eee'
          }}>
            <button
              onClick={toggleLogs}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                color: '#333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>📝 Update History</span>
              <span>{showLogs ? '▲' : '▼'}</span>
            </button>

            {/* Logs Display */}
            {showLogs && (
              <div style={{ 
                marginTop: 10,
                border: '1px solid #e0e0e0',
                borderRadius: 4,
                backgroundColor: '#fafafa',
                maxHeight: 400,
                overflowY: 'auto'
              }}>
                {logsLoading ? (
                  <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
                    Loading logs...
                  </div>
                ) : eventLogs.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
                    No update history yet
                  </div>
                ) : (
                  eventLogs.map((log, index) => (
                    <div 
                      key={log._id || index}
                      style={{
                        padding: 12,
                        borderBottom: index < eventLogs.length - 1 ? '1px solid #e0e0e0' : 'none',
                        fontSize: 12
                      }}
                    >
                      {/* Log Header */}
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: 8
                      }}>
                        <div style={{ fontWeight: 'bold', color: '#1976d2' }}>
                          👤 {log.eventTriggeredBy?.name || 'Unknown User'}
                        </div>
                        <div style={{ 
                          fontSize: 11, 
                          color: '#999',
                          whiteSpace: 'nowrap',
                          marginLeft: 10
                        }}>
                          🕒 {utcToLocal(log.createdAtUTC, viewerTz)}
                        </div>
                      </div>

                      {/* Changes */}
                      {log.diff && Object.keys(log.diff).length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          {Object.entries(log.diff).map(([field, values]) => (
                            <div 
                              key={field}
                              style={{
                                padding: '6px 8px',
                                backgroundColor: 'white',
                                borderRadius: 4,
                                marginBottom: 6,
                                border: '1px solid #e0e0e0'
                              }}
                            >
                              <div style={{ 
                                fontWeight: 500, 
                                color: '#666',
                                marginBottom: 4
                              }}>
                                {getFieldLabel(field)}:
                              </div>
                              <div style={{ marginLeft: 8 }}>
                                <div style={{ 
                                  color: '#d32f2f',
                                  textDecoration: 'line-through',
                                  fontSize: 11,
                                  marginBottom: 2
                                }}>
                                  ✗ {formatChangeValue(field, values[0])}
                                </div>
                                <div style={{ 
                                  color: '#388e3c',
                                  fontSize: 11,
                                  fontWeight: 500
                                }}>
                                  ✓ {formatChangeValue(field, values[1])}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Edit Mode - Same as before */}
          <form onSubmit={handleUpdate}>
            <h4 style={{ margin: 0, marginBottom: 15, color: '#2196F3' }}>
              ✏️ Edit Event
            </h4>

            <label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 500 }}>
              Title *
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              disabled={isUpdating}
              required
              style={{
                width: '100%',
                padding: 8,
                marginBottom: 12,
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: 14,
                boxSizing: 'border-box'
              }}
            />

            <label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 500 }}>
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              disabled={isUpdating}
              rows={3}
              style={{
                width: '100%',
                padding: 8,
                marginBottom: 12,
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: 14,
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />

            <label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 500 }}>
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={editForm.start}
              onChange={(e) => setEditForm({ ...editForm, start: e.target.value })}
              disabled={isUpdating}
              style={{
                width: '100%',
                padding: 8,
                marginBottom: 12,
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: 14,
                boxSizing: 'border-box'
              }}
            />

            <label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 500 }}>
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={editForm.end}
              onChange={(e) => setEditForm({ ...editForm, end: e.target.value })}
              min={editForm.start}
              disabled={isUpdating}
              style={{
                width: '100%',
                padding: 8,
                marginBottom: 15,
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: 14,
                boxSizing: 'border-box'
              }}
            />

            {editForm.start && editForm.end && new Date(editForm.end) <= new Date(editForm.start) && (
              <div style={{
                padding: 8,
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeeba',
                borderRadius: 4,
                color: '#856404',
                fontSize: 12,
                marginBottom: 12
              }}>
                ⚠️ End date/time must be after start date/time
              </div>
            )}

            <div style={{
              padding: 8,
              backgroundColor: '#e3f2fd',
              border: '1px solid #b3d9ff',
              borderRadius: 4,
              fontSize: 12,
              color: '#1976d2',
              marginBottom: 12
            }}>
              📝 Editing as: <strong>{viewer?.name || 'Unknown'}</strong>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                disabled={isUpdating}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: isUpdating ? '#95a5a6' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                {isUpdating ? '💾 Saving...' : '💾 Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}