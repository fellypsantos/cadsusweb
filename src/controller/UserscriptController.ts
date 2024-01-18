import { Request, Response } from 'express';
import path from 'path';

export const getUserScriptContent = (_: Request, response: Response): void => {
  const scriptPath = path.join(__dirname, '..', 'tampermonkey', 'cadsusweb.user.js');
  response.sendFile(scriptPath);
};
