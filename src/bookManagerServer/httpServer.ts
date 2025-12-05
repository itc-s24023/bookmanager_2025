/**
 * Server Configuration
 * Express サーバーとミドルウェアの設定
 *
 * このファイルは以下を設定します:
 * - Express アプリケーションの初期化
 * - 基本ミドルウェア (JSON, URLエンコード, Cookie)
 * - Redis セッションストア
 * - Passport 認証
 * - グレースフルシャットダウン
 */

import { env_config } from "../bookManagerConfig/environment.js";
import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import session from "express-session";

// ===================================
// Express Application Setup
// ===================================
export const app = express();
export const server = http.createServer(app);

// ===================================
// Health Check Endpoint
// ===================================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env_config.NODE_ENV,
    session: env_config.SERVER_SESSION,
  });
});

// ===================================
// Basic Middleware
// ===================================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ===================================
// Redis Session Store
// ===================================
let redisClient;
let redisStore;

try {
  redisClient = await createClient({ url: env_config.REDIS_URL })
    .on("error", () => {})
    .connect();

  redisStore = new RedisStore({
    client: redisClient,
    prefix: "session:",
    ttl: 60 * 60,
  });
} catch {
  process.exit(1);
}

// ===================================
// Session Configuration
// ===================================
app.use(
  session({
    secret: env_config.SESSION_SECRET, // セッション署名用シークレット
    resave: false, // セッションが変更されていない場合は保存しない
    saveUninitialized: false, // 初期化されていないセッションは保存しない
    name: "mb_sid", // セッションIDのCookie名
    cookie: {
      maxAge: 1000 * 60 * 60, // 有効期限: 1時間
      httpOnly: true, // JavaScriptからアクセス不可
      secure: env_config.NODE_ENV === "production", // HTTPS接続時のみCookieを送信
      sameSite: "lax", // CSRF対策
    },
    store: redisStore, // Redisをセッションストアとして使用
  })
);

// ===================================
// Passport Authentication
// ===================================
app.use(passport.authenticate("session"));

// ===================================
// Graceful Shutdown Handler
// ===================================
/**
 * アプリケーションの正常終了を処理
 * - Redis接続をクローズ
 * - HTTPサーバーをクローズ
 * - タイムアウト時は強制終了
 */
const gracefulShutdown = async () => {
  try {
    if (redisClient) {
      await redisClient.quit();
    }

    server.close(() => {
      process.exit(0);
    });

    setTimeout(() => {
      process.exit(1);
    }, 10000);
  } catch {
    process.exit(1);
  }
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("unhandledRejection", () => {});
process.on("uncaughtException", gracefulShutdown);

server.listen(env_config.PORT, () => {});

server.on("error", () => {
  process.exit(1);
});
