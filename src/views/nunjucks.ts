import { Express } from 'express';
import { configure } from 'nunjucks';

export const initTemplateEngine = (express: Express): void => {
  configure('./src/views', {
    autoescape: true,
    express: express,
    watch: true
  });
};
