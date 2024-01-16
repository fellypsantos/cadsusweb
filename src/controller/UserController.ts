import { Request, Response } from 'express';
import { findUserByCns } from '../service/UserService';

export const userExists = async (request: Request, response: Response): Promise<Response> => {
  const { cns } = request.params;

  const user = await findUserByCns(cns);

  if (!user) return response.json(null);

  return response.json(user);
};
