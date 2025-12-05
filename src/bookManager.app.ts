/**
 * NJS Book Manager - Main Application
 * 書籍管理システムのメインアプリケーション
 */

import { app } from "./bookManagerServer/httpServer.js";
import { env_config } from "./bookManagerConfig/environment.js";

// ===================================
// Middleware
// ===================================
import { middlewareRequestLog } from "./bookManagerCore/_dev/requestLogger.middleware.js";

// ===================================
// Route Handlers
// ===================================
import userRoute from "./bookManagerRoutes/user/user.routes.js";
import adminRoute from "./bookManagerRoutes/admin/admin.routes.js";
import bookRoute from "./bookManagerRoutes/book/book.routes.js";
import searchRoute from "./bookManagerRoutes/search/search.routes.js";

// ===================================
// Apply Middleware
// ===================================
app.use(middlewareRequestLog);

// ===================================
// API Routes
// ===================================
app.use("/user", userRoute); // ユーザー認証・管理
app.use("/admin", adminRoute); // 管理者機能
app.use("/book", bookRoute); // 書籍操作
app.use("/search", searchRoute); // 検索機能

// ===================================
// Error Handling
// ===================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

app.use((err: Error, req: any, res: any, next: any) => {
  if (env_config.SHOW_DB_ERRORS) {
    console.error("[Error]", err);
  }
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message:
      env_config.NODE_ENV === "production" ? "An error occurred" : err.message,
  });
});
