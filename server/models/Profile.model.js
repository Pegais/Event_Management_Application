const mongoose=require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name:{type:String,required:true},
    timezone:{type:String,required:true,default:"UTC"},
    createdAt:{type:Date,default:()=>new Date()}
})

module.exports=mongoose.model("ProfileModel",ProfileSchema);