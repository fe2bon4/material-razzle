import express from 'express';
import logger from './server/logger';

declare global {
  interface Window {
    env: any;
  }
}

const { PORT = '3000' } = process.env;

let app = require('./server').default;

if (module.hot) {
  module.hot.accept('./server', () => {
    logger.info('🔁  HMR Reloading `./server`...');
    try {
      app = require('./server').default;
    } catch (error) {
      logger.error(error);
    }
  });
  logger.info('✅  Server-side HMR Enabled!');
}

const port = parseInt(PORT, 10);

export default express()
  .use((req, res) => app.handle(req, res))
  .listen(port, () => {
    logger.info(`> App started http://localhost:${port}`);
  });
