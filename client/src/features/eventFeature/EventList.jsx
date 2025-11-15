// EventList.jsx - WITH DEBUGGING
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventData } from "./Events";
import { fetchProfileData } from "../profileFeature/profiles";
import EventCard from "./EventCard";
import "../../styles/components.css";

export default function EventList() {
  const dispatch = useDispatch();
  
  const events = useSelector((state) => state.events.list);
  const loading = useSelector((state) => state.events.loading);
  const selectedProfile = useSelector((state) => state.profiles.selectedId);
  const profiles = useSelector((state) => state.profiles.list);
  
  console.log(selectedProfile,"profile selected");
  const [isRefreshing, setIsRefreshing] = useState(false);



  // Load profiles on mount
  useEffect(() => {
    if (profiles.length === 0) {
      console.log("Loading profiles...");
      dispatch(fetchProfileData());
    }
  }, [dispatch, profiles.length]);

  // Fetch events when a profile is selected
  useEffect(() => {
    if (selectedProfile) {
      console.log(">>> Fetching events for profile:", selectedProfile);
      dispatch(fetchEventData(selectedProfile))
        .unwrap()
        .then((data) => {
          console.log(">>> Events fetched successfully:", data);
        })
        .catch((error) => {
          console.error(">>> Error fetching events:", error);
        });
    }
  }, [selectedProfile, dispatch]);

  const handleRefresh = async () => {
    if (!selectedProfile) {
      alert("Please select a profile first");
      return;
    }

    setIsRefreshing(true);
    try {
      const result = await dispatch(fetchEventData(selectedProfile)).unwrap();
      console.log("Events refreshed successfully:", result);
    } catch (error) {
      console.error("Error refreshing events:", error);
      alert("Failed to refresh events");
    } finally {
      setIsRefreshing(false);
    }
  };

  const currentProfile = profiles.find(p => p._id === selectedProfile);

  // DEBUG: What are we rendering?
  console.log("RENDER CHECK:", {
    hasSelectedProfile: !!selectedProfile,
    isLoading: loading,
    eventsCount: events.length,
    currentProfile: currentProfile?.name
  });

  return (
    <div className="event-list-container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottom: '2px solid #e0e0e0'
      }}>
        <div >
          <h3 style={{ margin: 0, marginBottom: 5 }}>My Events</h3>
          {currentProfile && (
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
              Viewing as: <strong>{currentProfile.name}</strong> ({currentProfile.timezone})
            </p>
          )}
          {/* DEBUG INFO */}
          <p style={{ margin: '5px 0 0 0', fontSize: 11, color: '#999', fontFamily: 'monospace' }}>
            Debug: Profile={selectedProfile ? '✓' : '✗'} | Events={events.length} | Loading={loading ? 'YES' : 'NO'}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || !selectedProfile}
          style={{
            padding: '2px 8px',
            backgroundColor: isRefreshing ? '#95a5a6' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: (isRefreshing || !selectedProfile) ? 'not-allowed' : 'pointer',
            fontSize: 14,
            fontWeight: 500,
            opacity: (isRefreshing || !selectedProfile) ? 0.6 : 1,
            transition: 'background-color 0.3s ease'
          }}
        >
          {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh Events'}
        </button>
      </div>

      {!selectedProfile ? (
        <div style={{
          padding: 40,
          textAlign: 'center',
          backgroundColor: '#fff3cd',
          borderRadius: 8,
          border: '2px solid #ffc107'
        }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>👤</div>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
            No Profile Selected
          </h4>
          <p style={{ margin: 0, fontSize: 16, color: '#856404' }}>
            Please select a profile from the "Available Users" section above to view their events
          </p>
        </div>
      ) : loading ? (
        <div style={{
          padding: 40,
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>⏳</div>
          <p style={{ margin: 0, fontSize: 16 }}>Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div style={{
          padding: 40,
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: 8,
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>📅</div>
          <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>
            No Events Found
          </h4>
          <p style={{ margin: 0, fontSize: 14, color: '#999' }}>
            This profile doesn't have any events yet. Create an event to get started!
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: 12, color: '#ccc', fontFamily: 'monospace' }}>
            Profile ID: {selectedProfile}
          </p>
        </div>
      ) : (
        <>
          <div style={{ 
            marginBottom: 15, 
            padding: 10, 
            backgroundColor: '#e3f2fd',
            borderRadius: 4,
            fontSize: 14,
            color: '#1976d2'
          }}>
            📊 Showing <strong>{events.length}</strong> event{events.length !== 1 ? 's' : ''} for <strong>{currentProfile.name}</strong>
          </div>
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}