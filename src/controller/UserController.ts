import { Request, Response } from 'express';
import { findUserByCns, handleAddUser } from '../service/UserService';

export const findUser = async (request: Request, response: Response): Promise<Response> => {
  const { cns } = request.params;

  const user = await findUserByCns(cns);

  if (!user) return response.json(null);

  return response.json(user);
};

export const addUser = async (request: Request, response: Response): Promise<Response> => {

  const result = await handleAddUser(request.body);

  return response.send(result);

};
