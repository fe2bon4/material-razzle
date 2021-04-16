import express, { Express, Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import logger from "./logger";

const log_middleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, originalUrl } = req;
  const { statusCode } = res;
  logger.info(`${statusCode} ${method} ${originalUrl}`);
  next();
};

const auth_middleware = (req: Request, res: Response, next: NextFunction) => {
  const {
    BASIC_AUTH_ENABLE = undefined,
    BASIC_AUTH_USERNAME = "",
    BASIC_AUTH_PASSWORD = "",
  } = process.env;

  if (!BASIC_AUTH_ENABLE) {
    return next();
  }

  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [login, password] = Buffer.from(b64auth, "base64")
    .toString()
    .split(":");

  if (
    !login ||
    !password ||
    login !== BASIC_AUTH_USERNAME ||
    password !== BASIC_AUTH_PASSWORD
  ) {
    // Access granted...
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="401"');
  return res.status(401).send({
    code: "401",
    message: "Authentication required.",
  });

  // -----------------------------------------------------------------------
};

// Define Middleware Here
export default (server: Express) => {
  server.use(express.json());

  server.use("*", log_middleware);

  server.use("*", auth_middleware);
};
