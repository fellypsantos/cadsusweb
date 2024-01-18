import { Express } from 'express';
import { configure } from 'nunjucks';
import { getAbsolutePath } from '../helper/pathHelper';

export const initTemplateEngine = (express: Express): void => {
  const viewsPath = getAbsolutePath('views');

  configure(viewsPath, {
    autoescape: true,
    express: express,
    watch: true
  });
};
