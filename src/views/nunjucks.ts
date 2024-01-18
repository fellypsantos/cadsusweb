import { Express } from 'express';
import { configure } from 'nunjucks';
import path from 'path';

export const initTemplateEngine = (express: Express): void => {
  const rootDir = process.env.NODE_ENV === 'production' ? process.cwd() : path.join(process.cwd(), 'src');
  const viewsPath = path.join(rootDir, 'views');

  configure(viewsPath, {
    autoescape: true,
    express: express,
    watch: true
  });
};
