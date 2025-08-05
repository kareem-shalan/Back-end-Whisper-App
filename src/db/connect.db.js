import mongoose from 'mongoose'

const connectDB = async () => {
    const url = process.env.DB_URI
    try {
        await mongoose.connect(url)
        console.log(mongoose.models);


        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB    