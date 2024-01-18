import express, { json } from 'express';
import cors from 'cors';
import routes from './routes';

import './datefns';
import './database/model/User';

import { initTemplateEngine } from './views/nunjucks';
import { dbConnect, getMongoDbSettings } from './database';
import chalk from 'chalk';

const initSystem = async (): Promise<void> => {
  const api = express();
  const dbSettings = await getMongoDbSettings();

  if (!dbSettings) {
    console.log(chalk.red('Falha na leitura do arquivo mongodb.ini'));
    process.exit();
  }

  dbConnect(dbSettings.serverIp);
  initTemplateEngine(api);

  api.set('view engine', 'njk');
  api.use(json());
  api.use(cors());
  api.use(routes);

  api.listen(7125, () => {
    console.log('\n', chalk.green(':::::: Servidor Rodando! ::::::'), '\n');
    console.log(chalk.yellow('..:: Não feche essa janela ::..'), '\n');

    console.log(`   MongoDB: http://${dbSettings.serverIp}:27017`);
    console.log('Userscript: http://localhost:7125/script.user.js', '\n\n');
  });
};

initSystem();
