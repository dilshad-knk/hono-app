

import { Context } from 'hono';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (c: Context) => {
  const { email, password } = await c.req.json();

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userName = email.split('@')[0];

    const user = new User({ email, password: hashedPassword, userName });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

   
    c.header('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Path=/`);

    return c.json({ message: 'user registered' }, 201);
  } catch (error) {
    return c.json({ message: 'failed to register user', error }, 500);
  }
};

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    
    c.header('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Path=/`);

    const { password: _, ...userObject } = user.toObject();

    return c.json({
      message: 'access granted',
      user: userObject,
      token
    }, 200);

  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500);
  }
};
