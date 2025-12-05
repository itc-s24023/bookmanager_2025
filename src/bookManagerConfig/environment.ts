/**
 * Environment Configuration
 * 環境変数の検証と設定
 */

const {
  DATABASE_URL,
  SESSION_SECRET,
  //--------------------------------------------------------
  NODE_ENV,
  REDIS_URL,
  PORT,
  SHOW_REQUEST_LOG,
  SHOW_DB_ERRORS,
  DB_SESSION_INTERVAL,
  //--------------------------------------------------------
  APP_USER_PASS_MIN_LENGTH,
  APP_DUE_DAYS,
} = process.env;

if (!DATABASE_URL) throw new Error("ENV: DATABASE_URL が定義されていません。");
if (!SESSION_SECRET)
  throw new Error("ENV: SESSION_SECRET が定義されていません。");

export const env_config = {
  // ===================================
  // 必須環境変数
  // ===================================
  /** データベース接続URL */
  DATABASE_URL,
  /** セッションシークレット */
  SESSION_SECRET,

  // ===================================
  // サーバー設定
  // ===================================
  /** 実行環境 (development/production) */
  NODE_ENV: NODE_ENV || "development",
  /** サーバーセッションID */
  SERVER_SESSION: crypto.randomUUID(),
  /** サーバーポート番号 */
  PORT: PORT ? Number(PORT) : 3000,

  // ===================================
  // Redis設定
  // ===================================
  /** Redis接続URL */
  REDIS_URL: REDIS_URL || "redis://localhost:6379",
  /** データベースセッションの有効期限（ミリ秒） */
  DB_SESSION_INTERVAL: DB_SESSION_INTERVAL ? Number(DB_SESSION_INTERVAL) : 0,

  // ===================================
  // デバッグ設定
  // ===================================
  /** リクエストログをコンソールに表示するか */
  SHOW_REQUEST_LOG: SHOW_REQUEST_LOG === "true",
  /** データベースエラーをコンソールに表示するか */
  SHOW_DB_ERRORS: SHOW_DB_ERRORS === "true",

  //--------------------------------------------------------

  /** ユーザーパスワードの最低文字数 */
  APP_USER_PASS_MIN_LENGTH: APP_USER_PASS_MIN_LENGTH
    ? Number(APP_USER_PASS_MIN_LENGTH)
    : 8,
  /** 返却期限（日数） */
  APP_DUE_DAYS: APP_DUE_DAYS ? Number(APP_DUE_DAYS) : 7,
};
