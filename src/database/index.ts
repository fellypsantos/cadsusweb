import { connect } from 'mongoose';
import chalk from 'chalk';
import fs from 'fs/promises';
import { parse } from 'ini';
import { getAbsolutePath } from '../helper/pathHelper';
import Logger from '../service/Logger';

export const dbConnect = async (serverIp: string): Promise<void> => {
  try {
    const connectionUrl = `mongodb://${serverIp}/cadsus-local-api`;

    await connect(connectionUrl, {
      connectTimeoutMS: 5000,
    });

    console.log("MongoDB connected!");
  }
  catch (err) {
    const error = err as Error;
    const message = 'Não foi possível conectar ao banco de dados.';

    Logger(chalk.bgRed(message, error.message));

    setTimeout(() => process.exit(), 3000);
  }
};

export type MongoDBSettings = {
  serverIp: string;
}

export const getMongoDbSettings = async (): Promise<MongoDBSettings | null> => {
  try {
    const iniFilePath = getAbsolutePath('mongodb.ini');
    const data = await fs.readFile(iniFilePath, 'utf-8');
    const config = parse(data);

    return { serverIp: config.SERVER_IP };
  } catch (err) {
    const error = err as Error;
    console.error(`Error reading INI file: ${error.message}`);
  }

  return null;
};
