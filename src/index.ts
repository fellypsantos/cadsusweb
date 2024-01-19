import express, { json, static as staticDirectory } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import routes from './routes';

import './datefns';
import './database/model/User';

import { initTemplateEngine } from './views/nunjucks';
import { dbConnect, getMongoDbSettings } from './database';
import { getAbsolutePath } from './helper/pathHelper';
import { showMenu } from './service/MenuService';

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
  api.use(staticDirectory(getAbsolutePath('public')));
  api.use(json());
  api.use(cors());
  api.use(routes);

  api.listen(7125, () => {
    console.log('\n', chalk.green(':::::: Servidor Rodando! ::::::'), '\n');
    console.log(chalk.yellow('..:: Não feche essa janela ::..'), '\n');

    console.log(`   MongoDB: http://${dbSettings.serverIp}:27017`);
    console.log(chalk.cyan('Userscript: http://localhost:7125/script.user.js'));
    console.log(chalk.green('  Pesquisa: http://localhost:7125/search'), '\n\n');

    showMenu();
  });
};

initSystem();
