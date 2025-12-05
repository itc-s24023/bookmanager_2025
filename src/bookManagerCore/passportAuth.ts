import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import argon2 from "argon2";
import prisma from "./prismaClient.js";
import { env_config } from "../bookManagerConfig/environment.js";
import { db_getUserById } from "./db/userRepository.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await prisma.$transaction(async (tx) =>
        tx.user.findUnique({
          where: { email },
        })
      );

      // ユーザーが存在しない場合はログイン失敗
      if (!user)
        return done(null, false, {
          message: "メールアドレスまたはパスワードが違います",
        });

      if (!(await argon2.verify(user.password, password))) {
        // パスワード不一致でログイン失敗
        return done(null, false, {
          message: "メールアドレスまたはパスワードが違います",
        });
      }

      // ログイン成功
      return done(null, {
        id: user.id,
        isAdmin: user.isAdmin,
        server_session: env_config.SERVER_SESSION,
        updated_at: performance.now(),
      });
    }
  )
);


// セッションストレージにユーザー情報を保存する際の処理
passport.serializeUser<Express.User>((user, done) => {
  process.nextTick(() => {
    done(null, user);
  });
});

// セッションストレージから serializeUser 関数によって保存されたユーザー情報を
// 取ってきた直後になにかする設定
passport.deserializeUser<Express.User>((user, done) => {
  process.nextTick(async () => {
    // セッション情報の検証
    if (
      user.server_session !== env_config.SERVER_SESSION ||
      user.updated_at + env_config.DB_SESSION_INTERVAL < performance.now()
    ) {
      // DBから最新のユーザー情報を取得
      const db_data = await db_getUserById(user.id);
      // DBエラーの場合は未ログイン扱いにする
      if (!db_data.ok) return done(null, false);

      const dbUser = db_data.data;
      // ユーザーが存在しない、もしくは削除されている場合は未ログイン扱いにする
      if (!dbUser || dbUser.isDeleted) return done(null, false);
      // ユーザー情報を更新
      user.isAdmin = dbUser.isAdmin;
      user.server_session = env_config.SERVER_SESSION;
      user.updated_at = performance.now();
    }
    done(null, user);
  });
});

export default passport;
