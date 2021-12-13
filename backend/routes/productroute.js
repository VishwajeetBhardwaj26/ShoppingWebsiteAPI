const express= require("express");
const { getAllProducts,createProduct,updateProduct,deleteProduct,getProductDetails, createProductReview, getProductReviews, deleteReview} = require("../controllers/productcontroller");
const { isAuthenticatedUser,authorizeRole } = require("../middleware/auth");
const router=express.Router();

router.route("/products").get(getAllProducts);
router.route("/products/new").post(isAuthenticatedUser,authorizeRole("admin"),createProduct);
router.route("/product/:id").put(isAuthenticatedUser,authorizeRole("admin"),updateProduct).delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReview);




module.exports=router;