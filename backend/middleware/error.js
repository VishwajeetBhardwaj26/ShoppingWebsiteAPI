const ErrorHandler = require("../utils/errorHandler");
module.exports =(err,req,res,next)=>{
    err.statusCode=err.statusCode ||500;
    err.message=err.message ||"Internal Server Error";
    //Mongodb Id Error
    if(err.name==="CastError"){
        const message =`Invalid Id:${err.path}`;
        err=new ErrorHandler(message,400);
    }
    //Mongoose Duplicate Key Error
    if(err.code==11000){
        const message= `Duplicate ${Object.keys(err.keyValue)}Entered`;
        err=new ErrorHandler(message,400);
    }
    //wrong jwt error
    if(err.name==`JsonWebTokenError`){
        const message= `JsonWebToken is invalid please ,try again`;
        err=new ErrorHandler(message,400);
    }
    //jwt expire
    if(err.name==`TokenEExpiredError`){
        const message= `JsonWebToken is expired please ,try again`;
        err=new ErrorHandler(message,400);
    }


    res.status(err.statusCode).json({
        success:false,
        error:err,
    });

};