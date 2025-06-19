import mongoose from 'mongoose';


const connectDb = async () => {
    try {
       
        await mongoose.connect(process.env.DB as string);
        console.log("Db connected");
        
    } catch (error) {
        console.error(error);
    }
}

export default connectDb;