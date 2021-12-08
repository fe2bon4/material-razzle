import express, { Express, Request, Response } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from '../browser/App';

const { DOMAIN } = process.env;

const env = {
  domain: DOMAIN || 'localhost',
};

const createReactMarkup = (context: any, url: string) =>
  renderToString(
    <StaticRouter context={context} location={url}>
      <App />
    </StaticRouter>
  );

const createHTML = (markup: string, assets: any) => `<!doctype html>
  <html lang="">
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet='utf-8' />
      <title>Razzle TypeScript</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${
        assets.client.css
          ? `<link rel="stylesheet" href="${assets.client.css}">`
          : ''
      }
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
  </head>
  <body>
      <div id="root">${markup}</div>
      <script>
      window.env=${JSON.stringify(env)}
    </script>
      
  </body>
 
</html>`;

export default (server: Express) => {
  let assets: any;

  const syncLoadAssets = () => {
    assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
  };
  syncLoadAssets();

  const serveIndex = (req: Request, res: Response) => {
    const context = {};
    const markup = createReactMarkup(context, req.url);
    const page = createHTML(markup, assets);
    res.send(page);
  };

  server.use('/static', express.static('build/public/static'));

  server.get('/*', serveIndex);

  server.disable('x-powered-by');
};
