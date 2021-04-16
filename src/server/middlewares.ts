import { Express, Request, Response, NextFunction } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware';
import logger from './logger'

const log_middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, url } = req;
  const { statusCode } = res;
  logger.info(`${statusCode} ${method} ${url}`);

  next();
};


// Define Middleware Here
export default ( server: Express )  => {
  server.use('*', log_middleware);


  server.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://localhost:3030',
      ws: true,
    })
  );


}