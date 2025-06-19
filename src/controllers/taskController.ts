import Task from "../models/Task";
import User from "../models/User";
import { Context } from "hono";

export const getTasks = async (c: Context) => {
  const userId = c.get("userId"); 

  try {
    const user = await User.findById(userId).populate("tasks").exec();
    if (!user) return c.json({ error: "User not found" }, 404);

    return c.json({ tasks: user.tasks }, 200);
  } catch (err) {
    return c.json({ error: "Failed to fetch tasks", details: err }, 500);
  }
};


export const createTask = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const { title, description, priority, deadline, status } = await c.req.json();

    const user = await User.findById(userId);
    if (!user) return c.json({ error: "User not found" }, 404);

    const task = new Task({
      user: userId,
      title,
      description,
      priority,
      deadline,
      status,
    });

    const savedTask = await task.save();

    user.tasks.push(savedTask._id);
    await user.save();

    return c.json({ message: "Task created successfully" }, 201);
  } catch (error) {
    return c.json({ error: "Error creating task", details: error }, 500);
  }
};


export const updateTask = async (c: Context) => {
  const taskId = c.req.param("taskId");
  const updateData = await c.req.json();

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) return c.json({ error: "Task not found" }, 404);

    return c.json({ message: "Task updated successfully", task: updatedTask }, 200);
  } catch (error) {
    return c.json({ error: "Error updating task", details: error }, 500);
  }
};

export const deleteTask = async (c: Context) => {
  const taskId = c.req.param("taskId");
  const userId = c.get("userId");

  try {
    const task = await Task.findById(taskId);
    if (!task) return c.json({ error: "Task not found" }, 404);

    if (task.user.toString() !== userId) {
      return c.json({ error: "You don't have permission to delete this task" }, 403);
    }

    await Task.findByIdAndDelete(taskId);
    await User.findByIdAndUpdate(userId, { $pull: { tasks: taskId } });

    return c.json({ message: "Task deleted successfully" }, 200);
  } catch (error) {
    return c.json({ error: "Error deleting task", details: error }, 500);
  }
};
