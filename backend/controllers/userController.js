const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require("../middleware/asyncErrors");
const User = require("../models/userModel");
const  sendToken= require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
//Registering a user
exports.registerUser = catchAsyncError((req,res,next)=>{
    const {name,email,password}= req.body;
    const user = User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is the public id from the cloud platform",
            url:"this is the url of the picture",
        },
    });
    sendToken(user,201,res);

});
exports.loginUser =catchAsyncError(async(req,res,next)=>{
    const{email,password}=req.body;
//checking if user have given both the fields
    if(!email||!password) {
        return next(new ErrorHandler("Please enter Email and Password",400));
    }
    const user = await User.findOne({email:email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Kindly Fill the Correct Email or Password",401));
    }
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Please enter the field precisely",401))
    }
   sendToken(user,200,res);
});
//User Logout
exports.logout = catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });
    res.status(200).json({
        success:true,
        message:"Logged Out Successfully"
    });
});
//Forgot Password
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user= await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("user not found",404));
    }
    //Get ResetPassword token
    const ResetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});
    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message=`Here is your link to reset your Password :- \n\n${resetPasswordUrl}`;
    try {
        await sendEmail({
            email:user.email,
            subject:`Password Recovery Email`,
            message,

        });
        res.status(200).json({
            success:true,
            message:`Email sent to  ${user.email}successfully`,
        })
        
    } catch (error) {
        user.getResetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message,500))
        
    }

});
//Reset Password
exports.resetPassword= catchAsyncError(async(req,res,next)=>{
    //creating tokenHash
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire={$gt:Date.now()},
    });
    if(!user){
        return next(new ErrorHandler("Reset Password Token is not valid or expired",400));

    }
    if(req.body.password !=req.body.confirmPassword){
        return next(new ErrorHandler("Please retype your password",400));
    }
    user.password=req.body.password
    user.resetPasswordToken= undefined,
    user.resetPasswordExpire= undefined,
    await user.save();
    sendToken(user,200,res);

});
//Get User Details
exports.getuserDetails= catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    });

});
// update  User Password
exports.updatePassword= catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched=await user.comparePassword(req.body.oldpassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",400));
    }
    
    if(req.body.newPassword !==req.body.confirmPassword){
        return next(new ErrorHandler("Please enter the field precisely",400));
    }
    user.password=req.body.newPassword;
    await user.save();
    sendToken(user,200,res);


});
// update  User Profile
exports.updateProfile= catchAsyncError(async(req,res,next)=>{
   const newUserData={
       name:req.body.name,
       email:req.body.email,
   } ;
   const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
       new:true,
       runValidators:true,
   })
   res.status(200).json({
       success:true,
   });

});
//get all users(admin)
exports.getAllUser = catchAsyncError(async(req,res,next)=>{
    const users= await User.find();
    res.status(200).json({
        success:true,
        users,
    });
});
//get single user information(admin)
exports.getSingleUser = catchAsyncError(async(req,res,next)=>{
    const users= await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User doesnot exist with Id ${req.params.id}`));
    }
    res.status(200).json({
        success:true,
        user,
    });
});
// update  User Role
exports.updateRole= catchAsyncError(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    } ;
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
    })
    res.status(200).json({
        success:true,
    });
 
 });
 // Delete User (admin)
exports.deleteProfile= catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user not found with this id:${req.params.id}`))
    }
    await user.remove();
    res.status(200).json({
        success:true,
        message:"User deleted Successfully",
    });
 
 });




