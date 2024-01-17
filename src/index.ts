import express, { json } from 'express';
import cors from 'cors';

import routes from './routes';
import './database/model/User';
import { initTemplateEngine } from './views/nunjucks';
import { dbConnect } from './database';

const api = express();

initTemplateEngine(api);
dbConnect();

api.set('view engine', 'njk');
api.use(json());
api.use(cors());
api.use(routes);

api.listen(7125, () => console.log('Server running...'));
