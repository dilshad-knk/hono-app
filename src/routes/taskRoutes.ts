import {Hono} from "hono";
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/taskController';
import { verify } from '../middleware/authMiddleware';

const taskRoutes= new Hono();

taskRoutes.use('/tasks/*', verify);



taskRoutes.post('/tasks/create', createTask);
taskRoutes.get('/tasks', getTasks);
taskRoutes.put('/tasks/:taskId', updateTask);
taskRoutes.delete('/tasks/:taskId', deleteTask);

export default taskRoutes;
