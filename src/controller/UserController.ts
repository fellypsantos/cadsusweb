import { Request, Response } from 'express';
import { findUserByCns, handleAddUser, handleSearchUser, handleUpdateUser } from '../service/UserService';

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

export const updateUser = async (request: Request, response: Response): Promise<Response> => {
  const result = await handleUpdateUser(request.body);
  return response.json(result);
};

export const searchUser = async (request: Request, response: Response): Promise<Response> => {
  const { searchContent } = request.body;
  const result = await handleSearchUser(searchContent);
  return response.json(result);
};
