import chalk from 'chalk';
import User, { UserDocument } from '../database/model/User';
import Logger from './Logger';
import { UserType } from '../types/UserType';

export const findUserByCns = async (numeroCns: string): Promise<UserDocument | null> => {
  const user = await User.findOne({ numeroCns });

  if (!user) return null;

  return user;
};

export const findUsersByCns = async (numeroCns: string): Promise<UserDocument[] | null> => {
  const user = await User.find({ numeroCns });

  if (!user) return null;

  return user;
};

export const handleAddUser = async (userdata: UserType): Promise<UserDocument | null> => {
  try {
    Logger(JSON.stringify(userdata));
    const { numeroCns } = userdata;
    const user = await findUserByCns(numeroCns);

    if (user) return null;

    const createdUser = await User.create({ ...userdata, nome: userdata.nome.toUpperCase() });

    Logger(
      chalk.blue(createdUser.numeroCns),
      chalk.blue(createdUser.nome),
      'Salvo offline.'
    );

    return createdUser;
  }
  catch (err) {
    const error = err as Error;
    Logger('Falha ao salvar os dados no banco local: ', error.message);
    return null;
  }
};

export const handleUpdateUser = async (userdata: UserType): Promise<UserDocument | null> => {
  try {
    const { id, ...user } = userdata;

    const result = await User.findByIdAndUpdate(id, user, {
      new: true
    });

    return result;
  }
  catch (err) {
    const error = err as Error;
    Logger('Falha ao atualizar os dados no banco local: ', error.message);
    return null;
  }
};

export const handleDeleteUser = async (id: string): Promise<UserDocument | null> => {
  try {
    return await User.findByIdAndDelete(id);
  }
  catch (err) {
    const error = err as Error;
    Logger('Falha ao remover um usuário do banco local: ', error.message);
    return null;
  }
};

const isCnsNumber = (text: string): boolean => {
  const regex = new RegExp('[0-9]{15}');
  return regex.test(text);
};

export const handleSearchUser = async (searchContent: string): Promise<UserDocument[] | null> => {
  if (isCnsNumber(searchContent)) {
    return await User.find({ numeroCns: searchContent });
  }

  return await User
    .find({ nome: { $regex: new RegExp(searchContent, 'i') } })
    .sort({ nome: 'asc' });
};
