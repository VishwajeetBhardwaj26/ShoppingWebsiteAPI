const app = require("./app");
const dotenv =require("dotenv");
const database=require("./config/database");
//handling uncaught exception
process.on("uncaughtException",(err)=>{
console.log(`Error:${err.message}`);
console.log(`Sorry server is shutting down because of Uncaught exception`);
process.exit(1);
});

dotenv.config({path:"backend/config/config.env"});
database();
const server=app.listen(7000,()=>{
    console.log("server is listening on port 7000");
});
//Unhandled Promise Rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Sorry server is shutting down because of Unhandled Promise Rejection`);
    server.close(()=>{
          process.exit(1);
    });
});