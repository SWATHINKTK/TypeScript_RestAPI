import mongoose from "mongoose";
const connectionString:string | undefined = "mongodb://localhost:27017/dummy"

export const connectDB = async():Promise<void> => {
    try {
       await mongoose.connect(connectionString) 
       console.log('DB Connection Successful');
    } catch (error) {
        console.log(error)
    }
}