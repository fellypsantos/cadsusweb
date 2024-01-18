import express, { json } from 'express';
import cors from 'cors';
import routes from './routes';

import './dateFnsInit';
import './database/model/User';

import { initTemplateEngine } from './views/nunjucks';
import { dbConnect } from './database';
import chalk from 'chalk';


const mongodbParam = process.argv.indexOf('--mongodb');
const mongodbServer = mongodbParam > -1 ? process.argv[mongodbParam + 1] : '127.0.0.1';

const api = express();


initTemplateEngine(api);
dbConnect(mongodbServer);

api.set('view engine', 'njk');
api.use(json());
api.use(cors());
api.use(routes);

api.listen(7125, () => {
  console.log('\n', chalk.green(':::::: Servidor Rodando! ::::::'), '\n');
  console.log(chalk.yellow('..:: Não feche essa janela ::..'), '\n');

  console.log(`   MongoDB: http://${mongodbServer}:27017`);
  console.log('Userscript: http://localhost:7125/script.user.js', '\n\n');
});
