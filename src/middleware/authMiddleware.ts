import { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import jwt from 'jsonwebtoken';

export const verify: MiddlewareHandler = async (c, next) => {
  try {
    const token = getCookie(c, 'token');

    if (!token) {
      return c.json({ success: false, message: 'Unauthorized (No Token)' }, 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    
    c.set('userId', decoded.userId);

    await next(); 
  } catch (err) {
    return c.json({ success: false, message: 'Unauthorized (Invalid Token)', error: err }, 401);
  }
};
