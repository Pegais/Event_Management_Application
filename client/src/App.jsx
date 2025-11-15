
import './index.css';
import ProfilePage from "./features/profileFeature/profilePage"
import EventsPage from './features/eventFeature/EventPage';
import { useEffect } from 'react';
import { fetchProfileData } from './features/profileFeature/profiles';
import { useDispatch } from 'react-redux';
import EventList from './features/eventFeature/EventList';
function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchProfileData())
  }, []);
  return (
    <div className='MainBox'>
      <h2 >Event Management</h2>
      <div>
      <ProfilePage />
      <EventsPage />

      </div>
      <div>
       
      </div>
    </div>
  );
}

export default App;
