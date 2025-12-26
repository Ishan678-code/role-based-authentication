const express=require('express')
const authmiddleware=require("../middleware/auth-middleware")
const router=express.Router()
const adminmiddleware=require('../middleware/admin-middleware')
//
router.get("/welcome",authmiddleware,adminmiddleware,(req,res)=>{
    res.json({
        message:"welcome to admin page"
    })
})
module.exports=router;