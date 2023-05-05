import { connect } from "mongoose";
export const connectDB = () => {
    connect(process.env.MONGO_URL)
}



