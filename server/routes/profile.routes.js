const router =require('express').Router();

const ProfileController =require('../controllers/profile.controller');

//end to end api endpoint
// /profile/create : creating profiles
// /profile/ : getting all the profiles
router.post('/create',ProfileController.createNewProfile);
router.get('/',ProfileController.getAllProfiles);
router.patch('/:id',ProfileController.updateProfile)


module.exports=router