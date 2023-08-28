import mongoose from "mongoose";

// mongoose.connect("mongodb://127.0.0.1:27017/tms-miraki");

const connectDB = async () => {

    const url = "mongodb+srv://bhanupratap04123:mongo_bhanu4123@task-management.isarhcs.mongodb.net/task-management?retryWrites=true&w=majority";
    mongoose.connect(url, { useNewUrlParser: true });
    mongoose.connection.once('open', function () {
        console.log('Conection has been made!');
    }).on('error', function (error) {
        console.log('Error is: ', error);
    });
}
export default connectDB;
