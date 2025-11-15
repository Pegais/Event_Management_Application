import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import ApiUrl from "../../api/axiosApiClient";

export const fetchEventData = createAsyncThunk('/fetch/events', async (profileId) => {
  //passing profileId as query.
  console.log("CALLING THE FETCH");
  
 const response = await ApiUrl.get('/events/', {
  params: { profileId }
});
return response.data
});

export const createEventData = createAsyncThunk('/create/events', async (data) => {
  const response = await ApiUrl.post('/events/create', data);
  return response.data;
});

export const updateEventData = createAsyncThunk(
  'update/events',
  async ({ id, data }) => {
    console.log("UPDATING THE EVENTS:",id,data);
    
    const response = await ApiUrl.patch(`/events/update/${id}`, data);
    console.log("Event updated:", response.data);
    return response.data;
  }
);

// Frontend - Events.js (add this new action)
export const fetchEventLogs = createAsyncThunk(
  'events/fetchLogs',
  async (eventId) => {
    console.log("Fetching logs for event:", eventId);
    const response = await ApiUrl.get(`/events/${eventId}/logs`);
    console.log("Logs received:", response.data);
    return { eventId, logs: response.data };
  }
);
const eventFeatureSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    loading: false,
    logs:{} // Store logs by eventId: { eventId: [logs] }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventData.pending, (s) => { s.loading = true })
      .addCase(fetchEventData.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(createEventData.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
      .addCase(updateEventData.fulfilled, (state, action) => {
        const updatedEvent = action.payload;
        const index = state.list.findIndex(e => e._id === updatedEvent._id);
        if (index !== -1) {
          state.list[index] = updatedEvent;
        }
      })
      .addCase(fetchEventLogs.fulfilled, (state, action) => {
        const { eventId, logs } = action.payload;
        state.logs[eventId] = logs;
        console.log("Logs stored for event:", eventId);
      });
  }
})

export default eventFeatureSlice.reducer;

