import { Router } from 'express';
import { userExists } from './controller/UserController';

const routes = Router();

routes.get('/', (_, response) => {
  return response.render('index');
});

routes.get('/existe_usuario/:cns', userExists);

export default routes;
