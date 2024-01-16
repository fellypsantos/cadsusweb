import express, { json } from 'express';
import cors from 'cors';
import { configure } from 'nunjucks';
import { connect } from 'mongoose';

import routes from './routes';
import './model/User';

const api = express();

configure('./src/views', {
  autoescape: true,
  express: api,
  watch: true
});

connect('mongodb://192.168.11.200:27017/cadsus-local-api');

api.set('view engine', 'njk');
api.use(json());
api.use(cors());
api.use(routes);

api.listen(7125, () => console.log('Server running...'));
