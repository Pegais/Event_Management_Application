require("dotenv").config();
const app =require('./app');
const connectDB=require('./config/db');

const PORT =process.env.PORT || 4000;
connectDB();

app.get('/test',(req,res)=>{
    res.json({
        message:"server endpoint are working"
    })
})
app.listen(PORT,()=>{
    console.log(`Server running on port  ${PORT}`);
    
})