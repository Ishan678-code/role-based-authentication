const express=require('express');
const authmiddleware=require('../middleware/auth-middleware')
const router=express.Router() 
router.get('/welcome',authmiddleware,(req,res)=>{
    const {username,userId,role}=req.userInfo;

    res.json({
        message:'welcome to home page',
        user:{
            _id:userId,
            username,
            role
        }
    })
});

module.exports=router