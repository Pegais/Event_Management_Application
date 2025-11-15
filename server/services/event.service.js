const EventLogModel=require('../models/EventLog.model');
const EventModel=require('../models/Event.model');
const {localTimeToUTC}=require('../utils/timezone');

exports.createNewEvent=async(data)=>{
    //desrtucting the data, as per the model
    const {title,description,profiles,eventTimezone,start,end,createdBy}=data;
    
    const startUTC=localTimeToUTC(start,eventTimezone);
    const endUTC=localTimeToUTC(end,eventTimezone);

    if(endUTC <startUTC)throw new Error("End time should be always be after start time");

    const triggeredEvent = await EventModel.create({
        title,
        description,
        profiles,
        eventTimezone,
        startUTC,
        endUTC,
        createdBy
    })
    
    return triggeredEvent;
}


exports.updateTheEvent=async(id,data,modifiedBy)=>{
    console.log("LOG DATA FROM UPDATE EVENT SERVICE :",id,modifiedBy,data);
    
   const oldEvent= await EventModel.findById(id);
   if(!oldEvent)throw new Error("There is no such Event!");

   let diff ={};

   Object.keys(data).forEach((field)=>{
       if(field ==="start" || field ==="end")return;
        if(oldEvent[field]!==data[field]){
            diff[field]=[oldEvent[field],data[field]]
        }
   })

   if(data.start){
    const newStartUTC =localTimeToUTC(data.start,data.eventtimezone||oldEvent.eventTimezone);
    diff["startUTC"]=[oldEvent.startUTC,newStartUTC];
    oldEvent.startUTC=newStartUTC;
   }

   if(data.end){
    const newEndUTC=localTimeToUTC(data.end,data.eventTimezone||oldEvent.eventTimezone);
    diff["endUTC"]=[oldEvent.endUTC,newEndUTC];
    oldEvent.endUTC=newEndUTC;
   }

  Object.assign(oldEvent,data);
  oldEvent.updateAtUTC=new Date();
  await oldEvent.save();

  await EventLogModel.create({
    eventLogID:id,
    eventTriggeredBy:modifiedBy,
    diff
  })
  return oldEvent;


}

exports.getAllEvents=async(profileId)=>{
    return await EventModel.find({profiles:profileId}).populate("profiles");
}