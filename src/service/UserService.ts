import chalk from 'chalk';
import User, { UserDocument } from '../database/model/User';
import Logger from './Logger';

export const findUserByCns = async (numeroCns: string): Promise<UserDocument | null> => {
  const user = await User.findOne({ numeroCns });

  if (!user) return null;

  Logger(
    chalk.bgGreen(`${numeroCns}`),
    chalk.green('Recuperado da base local.')
  );

  return user;
};
