/**
 * Request Logger Middleware
 * リクエストログを記録するミドルウェア
 */

import { NextFunction, Request, Response } from "express";
import { env_config } from "../../bookManagerConfig/environment.js";

export async function middlewareRequestLog(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!env_config.SHOW_REQUEST_LOG) return next();

  const startTime = Date.now();

  res.once("finish", () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 400 ? "\x1b[31m" : "\x1b[32m";
    const reset = "\x1b[0m";

    console.log(
      `${statusColor}${req.method}${reset} ${res.statusCode} ${req.originalUrl} ${duration}ms`
    );

    const { body, params, query } = req;

    if (Object.keys(params).length > 0) {
      console.log("  📋 Params:");
      console.table(params);
    }

    if (Object.keys(query).length > 0) {
      console.log("  🔍 Query:");
      console.table(query);
    }

    if (body && Object.keys(body).length > 0) {
      console.log("  📦 Body:");
      console.table(body);
    }
  });

  next();
}
