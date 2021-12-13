const Product = require("../models/productmodels");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require("../middleware/asyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
//create Product ----admin
exports.createProduct =catchAsyncError(async(req,res,next)=>{
     const product= await Product.create(req.body);
     res.status(201).json({
          success:true,
          product
     });
});
//get all products
exports.getAllProducts = catchAsyncError(async(req,res)=>{
     resultPerPage=5;
     const apifeature = new ApiFeatures(product.find(),req.query).search().filter().pagination(resultPerPage);
     const products= await apifeature.query;
      res.status(200).json({
           success:true,
           products
 });
 });
//Get Product Details
exports.getProductDetails = catchAsyncError(async(req,res,next)=>{
     const product = await Product.findById(req.params.id);
     if(!product){
       return next(new ErrorHandler("Product Not Found",404));
     }
     res.status(200).json({
      success:true,
      product
 });
 });
//Updating the Product-----admin
exports.updateProduct = catchAsyncError(async(req,res,next)=>{
     let product = await Product.findById(req.params.id);
     if(!product){
          return next(new ErrorHandler("Product Not Found",404));
        }
     product = await Product.findByIdAndUpdate(req.params.id,req.body,{
          new:true,
          runValidators:true,
          useFindAndModify:false
     });
     res.status(200).json({
          success:true,
          product
     });
});
//Deleting The Product --- admin
exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
     const product= await Product.findById(req.params.id);
     if(!product){
          return next(new ErrorHandler("Product Not Found",404));
        }
     await product.remove();
     res.status(200).json({
          success:true,
          message:"Product Deleted Successfully"
     });
});
//Create New Review or Update the review
exports.createProductReview=catchAsyncError(async(req,res,next)=>{
     const {rating,comment,productId}=req.body;
     const review={
          user:req.user._id,
          name:req.user.name,
          rating:Number(rating),
          comment,


     };
     const  product = await Product.findById(productId);
     const isReviewed = product.reviews.find((rev)=>
          rev.user.toString() ===req.user._id.toString()
     );
     if(isReviewed){
          if( rev.user.toString() ===req.user._id.toString()){
               (rev.rating=rating),(rev.comment=comment); 
          }

     }else{
          product.reviews.push(review);
          product.numOfReviews=product.reviews.length;
     }
     let avg=0;
     product.ratings=product.reviews.forEach((rev)=>{
          avg+=rev.rating;
     })
     product.ratings=avg/product.reviews.length;
     await product.save({validateBeforeSave:false});
     res.status(200).json({
          success:true,
     });

});
//get all reviews of a product
exports.getProductReviews=catchAsyncError(async(req,res,next)=>{
     const product = await Product.findById(req.query.id);
     if(!product){
          return next(new ErrorHandler("Product not found",404));

     }
     res.status(200).json({
          success:true,
          reviews:product.reviews,
     });
});
//Delete Review
exports.deleteReview = catchAsyncError(async(req,res,next)=>{
     const product = await Product.findById(req.query.productId);
     if(!product){
          return next(new ErrorHandler("Product Not Found",404));
     }
     const reviews=product.reviews.filter((rev)=>rev._id.toString()!==req.query.id.toString());
     let avg=0;
     reviews.forEach((rev)=>{
          avg+=rev.rating;
     });
     const ratings=avg/reviews.length;
     const numOfReviews = reviews.length;
     await Product.findByIdAndUpdate(req.query.productId,{
          reviews,
          ratings,
          numOfReviews
     },{
          new:true,
          runValidators:true,

     });
     res.status(200).json({
          success:true,
     });

});























