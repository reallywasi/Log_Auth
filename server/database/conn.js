import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
async function connect()
{
const mongod=await MongoMemoryServer.create(); // will create a new mongo memory server whenever we'll start the server
const getUri=mongod.getUri();

// mongoose.set('strictQuery,true');
const db=await mongoose.connect(getUri);
console.log("DB CONNECTED ")
return db;
}

export default connect;
