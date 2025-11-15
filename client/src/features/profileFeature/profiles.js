// profiles.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiUrl from "../../api/axiosApiClient";

// Used for fetching the profile data
export const fetchProfileData = createAsyncThunk("fetch/profiles", async () => {
    const res = await ApiUrl.get('/profile/');
    console.log("fetching of profiles from server:", res.data);
    return res.data;
})

//Used for creating new profile data
export const createProfileData = createAsyncThunk('profiles/create', async (data) => {
    console.log(data, "profile data");
    const response = await ApiUrl.post('/profile/create', data);
    console.log("response from creating new profile", response);
    return response.data;
})

export const updateProfileData = createAsyncThunk('profiles/update', async ({ id, timezone }) => {
    const response = await ApiUrl.patch(`/profile/${id}`, { timezone });
    console.log("response from updating profile", response.data);
    return response.data;
})

// creating actions, reducers for the profiles.
const profileFeatureSlice = createSlice({
    name: "profiles",
    initialState: {
        list: [],
        selectedId: null,
        loading: false,
        error: null
    },
    reducers: {
        profileSelection: (state, action) => {
            state.selectedId = action.payload;
        },
        clearProfileSelection: (state) => {
            state.selectedId = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfileData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfileData.fulfilled, (state, action) => {
                console.log("Profiles received:", action.payload);
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchProfileData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createProfileData.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateProfileData.fulfilled, (state, action) => {
                console.log("UPDATE PROFILE FULFILLED", action.payload);
                const updatedProfile = action.payload;
                const index = state.list.findIndex(p => p._id === updatedProfile._id);
                if (index !== -1) {
                    state.list[index] = updatedProfile;
                }
                console.log("Updated Redux list:", state.list);
            })
    }
})

export const { profileSelection, clearProfileSelection } = profileFeatureSlice.actions;
export default profileFeatureSlice.reducer;