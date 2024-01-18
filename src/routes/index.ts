import { Router } from 'express';
import { addUser, findUser, updateUser } from '../controller/UserController';
import { generateCards } from '../controller/CardController';
import { handleDeleteUser } from '../service/UserService';
import { getUserScriptContent } from '../controller/UserscriptController';

const routes = Router();

routes.get('/', (_, response) => {
  return response.render('index');
});

routes.get('/user/:cns', findUser);
routes.get('/card/:cns', generateCards);
routes.post('/user', addUser);
routes.put('/user', updateUser);
routes.delete('/user/:id', handleDeleteUser);
routes.get('/script.user.js', getUserScriptContent);

export default routes;
