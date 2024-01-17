import { connect } from 'mongoose';
import notifier from 'node-notifier';
import chalk from 'chalk';

export const dbConnect = async (): Promise<void> => {
  try {
    await connect('mongodb://192.168.11.200:27017/cadsus-local-api', {
      connectTimeoutMS: 5000
    });
  }
  catch (err) {
    const error = err as Error;
    const message = 'Não foi possível conectar ao banco de dados.';

    console.log(chalk.bgRed(message, error.message));

    notifier.notify({
      title: 'Conexão Falhou!',
      message: message,
      sound: false
    });

    setTimeout(() => process.exit(), 3000);
  }
};
