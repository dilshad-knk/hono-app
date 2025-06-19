"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const User_1 = __importDefault(require("../models/User"));
const getTasks = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User_1.default.findById(userId).populate('tasks').exec();
        if (!user) {
            throw new Error('User not hh found');
        }
        res.status(200).json({ tasks: user.tasks });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch personal boards', err });
    }
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    console.log('hitted');
    try {
        const userId = req.userId;
        console.log(userId, 'idididididididiid');
        const { title, description, priority, deadline, status } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: 'user not found' });
        const task = new Task_1.default({
            user: userId,
            title,
            description,
            priority,
            deadline,
            status,
        });
        const savedtask = await task.save();
        user.tasks.push(savedtask._id);
        await user.save();
        res.status(201).json({ message: 'task created successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: "error creatin task" });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const updateData = req.body;
    try {
        const updatedTask = await Task_1.default.findByIdAndUpdate(taskId, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedTask)
            return res.status(404).json({ error: 'Task not found' });
        return res.status(200).json({ message: 'task updated successfully', task: exports.updateTask });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error updating task', });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    const userId = req.userId;
    console.log(taskId, 'id');
    console.log(userId, 'user');
    try {
        const task = await Task_1.default.findById(taskId);
        if (!task)
            return res.status(404).json({ error: 'Task not found' });
        console.log(task.user.toString());
        if (task.user.toString() !== userId) {
            return res.status(403).json({ error: 'User does not have permission to delete this task' });
        }
        await Task_1.default.findByIdAndDelete(taskId);
        await User_1.default.findByIdAndUpdate(userId, { $pull: { tasks: taskId } });
        return res.status(200).json({ message: 'Deleted Successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error updating task', });
    }
};
exports.deleteTask = deleteTask;
