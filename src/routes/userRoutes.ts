import { Hono } from 'hono';
import { createUser, login } from '../controllers/userController';

const userRoutes = new Hono();

userRoutes.post('/register', async (c) => {
  return await createUser(c);
});

userRoutes.post('/login', async (c) => {
  return await login(c);
});

export default userRoutes;
