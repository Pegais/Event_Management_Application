const router =require("express").Router();
const EventController =require('../controllers/event.controller');

router.post('/create',EventController.createEvent);
router.patch('/update/:id',EventController.updateEvent);
router.get('/',EventController.getAllEvents);
// Backend - eventRoutes.js
router.get('/:eventId/logs', EventController.getEventLogs);

module.exports=router;