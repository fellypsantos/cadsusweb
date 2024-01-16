import User, { UserDocument } from '../model/User';

export const findUserByCns = async (numeroCns: string): Promise<UserDocument | null> => {
  const user = await User.findOne({ numeroCns });

  if (!user) return null;

  console.log(`[${numeroCns}] Recuperado da base local.`);

  return user;
};
