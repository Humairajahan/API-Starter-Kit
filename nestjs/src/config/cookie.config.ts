import { CookieOptions } from 'express';

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 1000 * 60 * 60 * 24,
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? process.env.APP_DOMAIN : '',
};
