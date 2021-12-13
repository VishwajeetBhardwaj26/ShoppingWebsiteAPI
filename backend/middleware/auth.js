const asyncErrors=require("../middleware/asyncErrors");
const ErrorHandler= require("../utils/errorHandler");
const jwt=require("jsonwebtoken");
const User= require("../models/userModel");

exports.isAuthenticatedUser = asyncErrors(async(req,res,next)=>{
    const {token} = req.cookie;
    if(!token){
        return next(new ErrorHandler("Please login first to experience this feature",401));
    }
    const decodedData =jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
    
});
exports.authorizeRoles = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(
                `Role:${req.user.role}is not allowed to access this resource`,
                403
            )
            );
        }
        next();

    }
}