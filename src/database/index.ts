import { connect } from 'mongoose';
import notifier from 'node-notifier';
import chalk from 'chalk';

export const dbConnect = async (serverIp: string): Promise<void> => {
  try {
    await connect(`mongodb://${serverIp}/cadsus-local-api`, {
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
