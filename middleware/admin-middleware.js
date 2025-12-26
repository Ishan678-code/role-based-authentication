const isadminuser=(req,res,next)=>{
    if(req.userInfo.role!=='admin'){
        return res.status.json({
            success:false,
            message:'access denied! admin rights required'
        })
    }
    next()
}
module.exports=isadminuser