const express=require('express');
const { registerUser, loginUser, changePassword } = require('../controllers/auth-controller');
const authmiddleware=require('../middleware/auth-middleware')
const router=express.Router();



//all routes related to authentication and authorization
router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/change-password',authmiddleware,changePassword)


module.exports=router