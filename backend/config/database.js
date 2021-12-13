const mongoose = require ("mongoose");

const database=( )=>{
mongoose.connect(process.env.DB_URI,
    {useNewUrlParser:true,useUnifiedTopology:true})
    .then((data)=>{
        console.log(`mongodb connected with server: ${data.connection.host}`);

    })
}
module.exports=database;