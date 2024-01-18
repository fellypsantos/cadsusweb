import { Express } from 'express';
import { configure } from 'nunjucks';
import path from 'path';

export const initTemplateEngine = (express: Express): void => {
  const viewsPath = path.join(__dirname, 'views');

  configure(viewsPath, {
    autoescape: true,
    express: express,
    watch: true
  });
};
