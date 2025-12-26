const cloudinary=require('../config/cloudinary')
const uploadToCloudinary=async(filePath)=>{
    try {
        const result=await cloudinary.uploader.upload(filePath);
        return{
            url:result.secure_url,
            publicId:result.public_id
        }
        
    } catch (error) {
        console.log('error while uploading to cloudianry')
        throw new error('error while uploading to cloudianry')
    }
}

module.exports={uploadToCloudinary}