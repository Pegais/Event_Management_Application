const mongoose = require('mongoose');

const EventLogSchema = new mongoose.Schema({
    eventLogID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventModel", required: true
    },
    eventTriggeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProfileModel",
        required: true
    },
    diff:{type:Object},
    createdAtUTC: { type: Date, default: () => new Date() },
    updateAtUTC: { type: Date, default: () => new Date() },
   
})

module.exports = mongoose.model("EventLogModel", EventLogSchema);