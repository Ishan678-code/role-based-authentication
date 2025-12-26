const Image=require('../models/Image');
const {uploadToCloudinary}=require('../helpers/cloudinary-Helper')
const fs=require('fs');
const cloudinary=require('../config/cloudinary')
const { image } = require('../config/cloudinary');

const uploadImageController=async(req,res)=>{
try {
    //check if file is missing
    if(!req.file){
        res.status(500).json({
            success:false,
            message:'invalid file path'
        })
    }
    //upload to cloudinary
    const {url,publicId}=await uploadToCloudinary(req.file.path)

    //store the image url and public id along with uploaded userid in mongodb database
    const newlyuploadedImage= new Image({
        url,
        publicId,
        uploadedBy: req.userInfo.userId
    })

    await newlyuploadedImage.save();
    //to remove file 
fs.unlinkSync(req.file.path)
    res.status(201).json({
        success:true,
        message:'Image uploaded successfully',
        image:newlyuploadedImage
    })
} catch (error) {
    console.log(error);
    res.status(500).json({
        success:false,
        message:'something went wrong! please try again'
    })
    
}
}

const fetchImageController=async(req,res)=>{
  try {

    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit) ||5;
    const skip=(page-1)*limit;
 
    const sortBy= req.query.sortBy || 'createdAt'
    const sortOrder=req.query.sortOrder=== 'asc'?1 :-1
    const totalImages=await Image.countDocuments();
    const totalPages=Math.ceil(totalImages/limit);
    const sortObj={};
    sortObj[sortBy]=sortOrder
    const images=await Image.find().sort(sortObj).skip(skip).limit(limit);


    if(images){
        res.status(200).json({
            success:true,
            currentPage: page,
            totalPages:totalPages,
            totalImages: totalImages,
            data:images
        })
    }
  } catch (error) {
     console.log(error);
    res.status(500).json({
        success:false,
        message:'something went wrong! please try again'
    })
  }  
}

const deleteImageController=async(req,res)=>{
    try {
        const getcurrentImageId=req.params.id;
        const userId=req.userInfo.userId;
      
        const currentImage=await Image.findById(getcurrentImageId)
        if(!currentImage){
            return res.status(400).json({
                success:false,
                message:'Image not found'

            })

        }
        if(image.uploadedBy.toString() !==userId){
            return res.status(403).json({
                success:false,
                message:'you are not authorized to delete this image.'

            })
        }
        //delete this image first from cloudinary storage
        await cloudinary.uploader.destroy(image.publicId);

        //delete this image from mongodb
        await Image.findByIdAndDelete(getcurrentImageId);
        res.status(200).json({
            success:true,
            message:'image deleted successfully'
        })

         
    } catch (error) {
        console.log(error);
    res.status(500).json({
        success:false,
        message:'something went wrong! please try again'
    })
    }
}

module.exports={uploadImageController,
    fetchImageController,
    deleteImageController
}