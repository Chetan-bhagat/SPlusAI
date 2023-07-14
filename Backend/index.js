const {connection}=require('./Config/db');
require('dotenv').config();
const cors=require('cors')
const app=require('express')();
const {registerrouter}=require('./Routes/register.router')
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())

// *ROUTES*
app.use('/',registerrouter);


app.listen(9160,async()=>{
    try{
        await connection;
        console.log("Connected to DB")
    }catch(err){
        console.log(err)
    }
    console.log("Server is running..")
})