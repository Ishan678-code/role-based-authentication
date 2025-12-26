require('dotenv').config();
const express=require('express')
const dbconnection=require('./database/db')
const authRoutes=require('./routes/UserRoute')
const homeRoute=require('./routes/home-routes')
const adminRoute=require('./routes/admin-route')
const uploadImageRoutes=require('./routes/image-route')

dbconnection();
const app=express();

app.use(express.json());

app.use('/api/auth',authRoutes)
app.use('/api/home',homeRoute)
app.use('/api/admin',adminRoute)
app.use('/api/image',uploadImageRoutes)


const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server listening on ${port}`)
}); 


