const EventLogModel = require('../models/EventLog.model');
const eventServices =require('../services/event.service');

exports.createEvent = async(req,res,next)=>{
    try {
        const event = await eventServices.createNewEvent(req.body);
        res.status(201).json(event);
    } catch (error) {
        next(error)
    }
}


exports.updateEvent=async(req,res,next)=>{
    console.log("THIS IS DATA FOR MODIFIFCATION",req.body);
    const {title,description,start,end,modifiedBy}=req.body;
    const data= {title,description,start,end}
    const id=req.params.id
;    try {
        const event = await eventServices.updateTheEvent(
           id,
          data,
          modifiedBy
            
        )
        res.status(201).json({
            message:"Event has been Updated",
            event
        })
    } catch (error) {
        next(error)
    }
}


// Backend controller
exports.getAllEvents = async(req, res, next) => {
    try {
        const profileId = req.query.profileId;
        
        console.log("Received profileId:", profileId);
        
        if (!profileId) {
            return res.status(400).json({ 
                error: "profileId query parameter is required" 
            });
        }
        
        const events = await eventServices.getAllEvents(profileId);
        console.log("Events found:", events.length);
        
        res.json(events);
    } catch (error) {
        console.error("Error in getAllEvents:", error);
        next(error);
    }
}
// Backend - eventController.js (add this new controller)
exports.getEventLogs = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        
        const logs = await EventLogModel.find({ eventLogID: eventId })
            .populate('eventTriggeredBy', 'name timezone')
            .sort({ createdAtUTC: -1 }); // Most recent first
        
        console.log(`Found ${logs.length} logs for event ${eventId}`);
        res.json(logs);
    } catch (error) {
        console.error("Error fetching event logs:", error);
        next(error);
    }
};