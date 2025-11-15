import { useSelector, useDispatch } from "react-redux";
import { fetchEventData } from "./Events";
import { useEffect } from "react";
import EventCard from "./EventCard";
import EventForm from "./EventForm";
import "./../../styles/components.css";

export default function EventsPage() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.events);
  const selectedProfile = useSelector((s) => s.profiles.selected);

  useEffect(() => {
    if (selectedProfile) dispatch(fetchEventData(selectedProfile));
  }, [selectedProfile]);

  return (
    <div className="page-events">
      <h2>Events</h2>
      <EventForm />

      {/* {!selectedProfile && <p>Select a profile to view events.</p>}

      <div className="event-list">
        {list.map((ev) => (
          <EventCard key={ev._id} event={ev} />
        ))}
      </div> */}
    </div>
  );
}
