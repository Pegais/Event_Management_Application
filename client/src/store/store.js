import {configureStore}from "@reduxjs/toolkit";
import profileReducer from "../features/profileFeature/profiles"
import eventsReducer from "../features/eventFeature/Events"



export const store =configureStore({
   reducer:{
    profiles:profileReducer,
    events:eventsReducer
   }
})