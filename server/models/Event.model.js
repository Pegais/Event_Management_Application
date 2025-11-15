const mongoose=require('mongoose');

const EventSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    profiles:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProfileModel",
        required:true
    }],
     eventTimezone:{type:String,required:true},
     startUTC:{type:Date,required:true},
     endUTC:{type:Date,required:true},
    createdAtUTC:{type:Date,default:()=>new Date()},
    updateAtUTC:{type:Date,default:()=>new Date()},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"ProfileModel"}
})

module.exports=mongoose.model("EventModel",EventSchema);