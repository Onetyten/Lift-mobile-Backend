import dotenv from 'dotenv'
dotenv.config()
import mongoose,{Mongoose} from 'mongoose'



const MONGO_URL:string | undefined  = process.env.MONGO_URL


if (!MONGO_URL){
    throw new Error ('define the MONGO_URL environment variable inside .env file')
}


interface CachedMongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    var mongoose: CachedMongooseConnection;
}



let cachedConnection:CachedMongooseConnection = globalThis.mongoose

if (!cachedConnection){
    cachedConnection = globalThis.mongoose = {conn:null,promise:null}
}

async function mongoConnect():Promise<Mongoose>{
    if (cachedConnection.conn){
        console.log('Found a cached connection')
        return cachedConnection.conn
    }

    if (!cachedConnection.promise){
        console.log("creating new connection")
        const opts = {
            bufferCommands:false,
        }
        cachedConnection.promise = mongoose.connect(MONGO_URL as string,opts)
    }
    cachedConnection.conn = await cachedConnection.promise
    return cachedConnection.conn
}
export default mongoConnect;