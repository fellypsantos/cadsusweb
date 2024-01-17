import express, { json } from 'express';
import cors from 'cors';
import routes from './routes';

import './dateFnsInit';
import './database/model/User';

import { initTemplateEngine } from './views/nunjucks';
import { dbConnect } from './database';


const mongodbParam = process.argv.indexOf('--mongodb');
const mongodbServer = mongodbParam > -1 ? process.argv[mongodbParam + 1] : 'localhost';

const api = express();


initTemplateEngine(api);
dbConnect(mongodbServer);

api.set('view engine', 'njk');
api.use(json());
api.use(cors());
api.use(routes);

api.listen(7125, () => console.log('Server running...'));
