const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken');
//register controller
const registerUser = async (req, res) => {
  try {
    //extract user information from request body
    const { username, email, password, role } = req.body;

    //check if user is already exist in our db or not
    const checkexistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkexistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist with same username or same email.",
      });
    }

    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    //create a new user and save in your database
    const newlycreatedUser = new User({
      username,
      email,
      password: hashedpassword,
      role: role || "user",
    });
    await newlycreatedUser.save();

    if (newlycreatedUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "please try again",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

//login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //if the password is correct or not
    const passwordmatch = await bcrypt.compare(password, user.password);
    if (!passwordmatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    //create user token
    const accesstoken=jwt.sign({
        userId:user._id,
        username:user.username,
        role:user.role
    },process.env.JWT_SECRET_KEY,{
        expiresIn:'15m'
    })

    res.status(200).json({
        success:true,
        message:"logged successfully",
        accesstoken
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};
const changePassword=async(req,res)=>{
  try {
    const userId=req.userInfo.userId;


    //extract old and new password
    const {oldPassword, newPassword}=req.body;

    //find the current loggedin user
    const user=await User.findById(userId);
    if(!user){
      return res.status(400).json({
        success:false,
        message:'User not found'
      })
    }
    const isPassword=await bcrypt.compare(oldPassword,user.password)
    if(!isPassword){
      return res.status(400).json({
        success:false,
        message:'Invalid password'
      })
    }
      //hash the new password
      const salt=await bcrypt.genSalt(10);
      const hashednewpassword=await bcrypt.hash(newPassword,salt);

      //update the password
      user.password=hashednewpassword;
      await user.save();


      res.status(200).json({
        success:true,
        message:'password updated successfully'
      })
    

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
}

module.exports = { registerUser, loginUser,
  changePassword
 };
