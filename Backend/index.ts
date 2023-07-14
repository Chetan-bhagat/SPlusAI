const {connection}=require('./Config/db');
const { ApolloServer,gpl}=require('apollo-server');
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
require('dotenv').config();
const app=require('express')();

const typeDefs=gpl`
type Query{
    add:String
}
`
const resolvers={
    Query:{
        add:()=> "Hello Server"
    }
}

const server =new ApolloServer({
    typeDefs,
    resolvers,

});

server.listen().then(({url})=>{
console.log(`🚀 server is running at ${url}`)
})



// app.listen(9160,async()=>{
//     try{
//         await connection;
//         console.log("Connected to DB")
//     }catch(err){
//         console.log("error")
//     }

//     console.log("Server is running..")
// })