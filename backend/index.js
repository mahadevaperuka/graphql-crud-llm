const {ApolloServer} = require("apollo-server");
const {typeDefs} =require("./schema/type-defs");
const {resolvers} =require("./schema/resolvers");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); 

dotenv.config();

const MONGODB = process.env.DB_STRING

const server = new ApolloServer({typeDefs,resolvers});   
mongoose.connect(MONGODB, {})
        .then(()=>{
            console.log("MongoDB Connection Successful");
            return server.listen({port: 4000});
        })
        .then((res)=>{
            console.log(`Server running at ${res.url}`);
        })
        .catch(err=>console.log(`error: ${err}`));
