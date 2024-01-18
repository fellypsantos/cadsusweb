import { Request, Response } from 'express';
import { getAbsolutePath } from '../helper/pathHelper';

export const getUserScriptContent = (_: Request, response: Response): void => {
  const scriptPath = getAbsolutePath('tampermonkey', 'cadsusweb.user.js');
  response.sendFile(scriptPath);
};

