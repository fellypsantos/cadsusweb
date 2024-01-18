import { Request, Response } from 'express';
import path from 'path';

export const getUserScriptContent = (_: Request, response: Response): void => {
  const rootDir = process.env.NODE_ENV === 'production' ? process.cwd() : path.join(process.cwd(), 'src');
  const scriptPath = path.join(rootDir, 'tampermonkey', 'cadsusweb.user.js');
  response.sendFile(scriptPath);
};
