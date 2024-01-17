import chalk from 'chalk';
import User, { UserDocument } from '../database/model/User';

export const findUserByCns = async (numeroCns: string): Promise<UserDocument | null> => {
  const user = await User.findOne({ numeroCns });

  if (!user) return null;

  console.log(chalk.bgGreen(`${numeroCns}`), chalk.green('Recuperado da base local.'));

  return user;
};
