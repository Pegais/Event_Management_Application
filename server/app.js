const express =require("express");
const cors= require('cors');

const profileRoutes =require('./routes/profile.routes');
const eventRoutes=require('./routes/event.routes');

const errorHandler=require('./middleware/errorHandler')





const app= express();
app.use(cors());
app.use(express.json());


//routing middlewares
app.use('/profile',profileRoutes);
app.use('/events',eventRoutes);

// centralized error middleware;
app.use(errorHandler);

module.exports=app;
