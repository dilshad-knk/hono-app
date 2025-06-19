import dotenv from 'dotenv';
dotenv.config();

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';

import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import connectDb from './config/db';

connectDb(); 




const app = new Hono();

const production = process.env.NODE_ENV === 'production';

app.use(
  '*',
  cors({
    origin: production ? 'https://drag-n-plan.vercel.app' : 'http://localhost:5173',
    credentials: true,
  }),
);


app.route('/api/v1', userRoutes);
app.route('/api/v1', taskRoutes);



const PORT = Number(process.env.PORT) || 4000;
console.log(`Server running on http://localhost:${PORT}`);
serve({ port: PORT, fetch: app.fetch });