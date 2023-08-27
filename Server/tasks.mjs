import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:String,
    description:String,
    completed:Boolean
})

const taskModel = mongoose.model('tasks',taskSchema);

export default taskModel;