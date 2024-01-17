import chalk from 'chalk';
import notifier from 'node-notifier';
import User, { UserDocument } from '../database/model/User';
import Logger from './Logger';
import { UserType } from '../types/UserType';

export const findUserByCns = async (numeroCns: string): Promise<UserDocument | null> => {
  const user = await User.findOne({ numeroCns });

  if (!user) return null;

  return user;
};

export const handleAddUser = async (userdata: UserType): Promise<UserDocument | null> => {
  const { numeroCns } = userdata;
  const user = await findUserByCns(numeroCns);

  if (user) {
    Logger(
      chalk.bgYellow(numeroCns),
      chalk.yellow('Cadastro ja existe no banco de dados offline.')
    );
    return null;
  }

  const createdUser = await User.create(userdata);

  Logger(
    chalk.bgBlue(createdUser.numeroCns),
    chalk.blue(createdUser.nome),
    'Salvo offline.'
  );

  notifier.notify({
    title: 'CADSUS Local',
    message: 'Usuário foi salvo offline.',
    sound: false
  });

  return createdUser;
};

export const handleUpdateUser = async (userdata: UserType): Promise<UserDocument | null> => {
  const { id, ...user } = userdata;

  const result = await User.findByIdAndUpdate(id, user, {
    new: true
  });

  return result;
};

export const handleDeleteUser = async (id: string): Promise<UserDocument | null> => {
  return await User.findByIdAndDelete(id);
};
