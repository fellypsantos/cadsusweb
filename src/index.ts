import express, { json, static as staticDirectory } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import routes from './routes';
import http from 'http';
import { Server } from 'socket.io';

import './datefns';
import './database/model/User';

import { initTemplateEngine } from './views/nunjucks';
import { dbConnect, getMongoDbSettings } from './database';
import { getAbsolutePath } from './helper/pathHelper';
import { showMenu } from './service/MenuService';
import Logger from './service/Logger';
import { findUserByCns, handleAddUser, handleUpdateUser } from './service/UserService';

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

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // Allow all origins (or specify if needed)
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('sync_user', async (userToSync) => {
    const user = await findUserByCns(userToSync.numeroCns);
    
    if (!user) {
      console.log('Os dados do cartão serão salvos na base de dados local.');
      const addUserResult = handleAddUser(userToSync);

      if (!addUserResult) {
        console.log('Falha ao salvar o cartão no banco de dados local.');
        return;
      }

      console.log('Os dados foram salvos localmente!');
      socket.emit('sync_completed', addUserResult);
      return;
    }

    const updateResult = await handleUpdateUser({id: user.id, ...userToSync});

    if (!updateResult) {
      console.log('Falha ao sincronizar o cartão no banco de dados local.');
      return;
    }

    console.log('Os dados foram sincronizados localmente!');
    socket.emit('sync_completed', updateResult);
    return;
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('WebSocket server running on ws://localhost:3000');
});
