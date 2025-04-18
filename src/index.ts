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
import { findUsersByCns, handleAddUser, handleUpdateUser } from './service/UserService';
import User from './database/model/User';

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
    const users = await findUsersByCns(userToSync.numeroCns);
    let wiped = false;

    if (users && users.length > 1) {
      // if found duplicated cards by CNS
      // remove all of them
      const ids = users.map(user => user._id);
      await User.deleteMany({ _id: { $in: ids } });
      wiped = true;
      console.log('Registros duplicados foram removidos');
    }
    
    if (wiped || users?.length === 0) {
      // Save data locally
      console.log('Os dados do cartão serão salvos na base de dados local.');
      const addUserResult = await handleAddUser(userToSync);

      if (!addUserResult) {
        console.log('Falha ao salvar o cartão no banco de dados local.');
        return;
      }

      console.log('Os dados foram salvos localmente!');
      socket.emit('sync_completed', addUserResult);
      return;
    }

    const user = users && users.length === 1 ? users.at(0) : null;

    if(user) {
      const updatedUser = await handleUpdateUser({id: user.id, ...userToSync});

      if (!updatedUser) {
        console.log('Falha ao sincronizar o cartão no banco de dados local.');
        return;
      }

      console.log('Os dados foram sincronizados localmente!');
      socket.emit('sync_completed', updatedUser);
      return;
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('WebSocket server running on ws://localhost:3000');
});
