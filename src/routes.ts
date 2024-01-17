import { Router } from 'express';
import { addUser, findUser } from './controller/UserController';
import { generateCards } from './controller/CardController';

const routes = Router();

routes.get('/', (_, response) => {
  return response.render('index');
});

routes.get('/find_user/:cns', findUser);
routes.get('/card/:cns', generateCards);
routes.post('/user', addUser);

export default routes;
