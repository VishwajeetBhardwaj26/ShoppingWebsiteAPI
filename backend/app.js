const express = require("express");
const app = express();
const cookieParser=require("cookie-parser");
const errorMiddleware = require("./middleware/error");
app.use(express.json());
app.use(cookieParser());
//importing routes
const product = require("./routes/productroute");
const user = require("./routes/userRoute");
const order=require("./routes/orderRoute");
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
//  Middleware For errors
app.use(errorMiddleware);









module.exports=app;