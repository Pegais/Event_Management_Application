const ProfileModel = require('../models/Profile.model');

exports.createNewProfile = async (req, res, next) => {
    try {
        console.log(req.body,"new profiledetails");
        
        const profile = await ProfileModel.create(req.body);
        res.status(201).json(profile);
    } catch (error) {
        next(error)
    }
}


exports.getAllProfiles =async(req,res,next)=>{
    try {
       const profiles =await ProfileModel.find();
       res.status(201).json(profiles); 
    } catch (error) {
        next(error)
    }
}

exports.updateProfile=async(req,res,next)=>{
    console.log("update profile triggered...",req.body);
    
    try {
        const profile =await ProfileModel.findByIdAndUpdate(
          { _id: req.params.id},
            req.body,
            {new:true}
        )
    } catch (error) {
        
    }
}