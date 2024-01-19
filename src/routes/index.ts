import { Router } from 'express';
import { addUser, findUser, searchUser, updateUser } from '../controller/UserController';
import { generateCards, renderSearchCard } from '../controller/CardController';
import { handleDeleteUser } from '../service/UserService';
import { getUserScriptContent } from '../controller/UserscriptController';

const routes = Router();

routes.get('/', (_, response) => {
  return response.render('index');
});

routes.get('/user/:cns', findUser);
routes.get('/card/:cns', generateCards);
routes.get('/search', renderSearchCard);
routes.post('/search', searchUser);
routes.post('/user', addUser);
routes.put('/user', updateUser);
routes.delete('/user/:id', handleDeleteUser);
routes.get('/script.user.js', getUserScriptContent);

export default routes;
