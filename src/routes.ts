import { Router } from 'express';
import { findUser } from './controller/UserController';
import { generateCards } from './controller/CardController';

const routes = Router();

routes.get('/', (_, response) => {
  return response.render('index');
});

routes.get('/find_user/:cns', findUser);
routes.get('/card/:cns', generateCards);

export default routes;
