# 📚 Bookmanager_2025

Node.js + Express + Prisma で構築された書籍管理システム

## ✨ 特徴

- **認証システム**: Passport.js による安全なユーザー認証
- **書籍管理**: 書籍の登録・更新・削除・検索機能
- **貸出管理**: 書籍の貸出・返却機能
- **管理者機能**: 著者・出版社・書籍の管理
- **セッション管理**: Redis を使用した高速セッションストア

## 🛠 技術スタック

| カテゴリ       | 技術                 |
| -------------- | -------------------- |
| ランタイム     | Node.js + TypeScript |
| フレームワーク | Express              |
| ORM            | Prisma               |
| データベース   | PostgreSQL           |
| セッション     | Redis                |
| 認証           | Passport.js          |
| パスワード     | argon2               |
| バリデーション | express-validator    |

## 🚀 クイックスタート

### 前提条件

- Node.js 18 以上
- Docker & Docker Compose（推奨）
- pnpm（推奨）または npm

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd NJS_Book_manager-main

# 依存パッケージをインストール
pnpm install

# 環境変数を設定
cp .env.example .env
# .envファイルを編集して設定を行う
```

### 環境変数の設定

`.env`ファイルをプロジェトのルートに作成し、以下の内容を記述してください：

```env
# ===================================
# 必須設定
# ===================================
# PostgreSQL接続URL
DATABASE_URL="postgresql://book_manager:book_manager@localhost:5432/book_manager"
SHADOW_DATABASE_URL="postgresql://book_manager:book_manager@localhost:5432/_book_manager"

# Redis接続URL
REDIS_URL="redis://localhost:6379"

# セッション署名用シークレット（ランダムな長い文字列を設定）
SESSION_SECRET="your-super-secret-random-string-here"

# ===================================
# サーバー設定（オプション）
# ===================================
# 実行環境（development / production）
NODE_ENV=development

# サーバーポート番号（デフォルト: 3000）
PORT=3000

# ===================================
# デバッグ設定（オプション）
# ===================================
# リクエストログを表示（デフォルト: false）
SHOW_REQUEST_LOG=true

# データベースエラーを表示（デフォルト: false）
SHOW_DB_ERRORS=true

# データベースセッション更新間隔（ミリ秒、デフォルト: 0）
DB_SESSION_INTERVAL=0

# ===================================
# アプリケーション設定（オプション）
# ===================================
# パスワード最低文字数（デフォルト: 8）
APP_USER_PASS_MIN_LENGTH=8

# 書籍貸出期間（日数、デフォルト: 7）
APP_DUE_DAYS=7
```

### 起動

```bash
# Dockerコンテナ（PostgreSQL + Redis）とアプリケーションを起動
pnpm run dev

# アプリケーションのみを起動（データベースは別途用意）
pnpm run dev:app

# Dockerコンテナのみを起動
pnpm run docker

# Dockerコンテナを停止
pnpm run docker:down
```

サーバーが起動したら、以下の URL でアクセスできます：

- **API**: http://localhost:3000
- **ヘルスチェック**: http://localhost:3000/health

## 📖 API エンドポイント

### ユーザー認証

| メソッド | エンドポイント   | 説明             |
| -------- | ---------------- | ---------------- |
| POST     | `/user/register` | ユーザー登録     |
| POST     | `/user/login`    | ログイン         |
| GET      | `/user/history`  | 貸出履歴取得     |
| PUT      | `/user/change`   | ユーザー情報変更 |

### 書籍操作

| メソッド | エンドポイント       | 説明                       |
| -------- | -------------------- | -------------------------- |
| GET      | `/book/list/:page`   | 書籍一覧取得（ページング） |
| GET      | `/book/detail/:isbn` | 書籍詳細取得               |
| POST     | `/book/rental`       | 書籍貸出                   |
| PUT      | `/book/return`       | 書籍返却                   |

### 検索機能

| メソッド | エンドポイント      | 説明       |
| -------- | ------------------- | ---------- |
| GET      | `/search/author`    | 著者検索   |
| GET      | `/search/publisher` | 出版社検索 |

### 管理者機能

#### 著者管理

| メソッド | エンドポイント  | 説明         |
| -------- | --------------- | ------------ |
| POST     | `/admin/author` | 著者登録     |
| PUT      | `/admin/author` | 著者情報更新 |
| DELETE   | `/admin/author` | 著者削除     |

#### 出版社管理

| メソッド | エンドポイント     | 説明           |
| -------- | ------------------ | -------------- |
| POST     | `/admin/publisher` | 出版社登録     |
| PUT      | `/admin/publisher` | 出版社情報更新 |
| DELETE   | `/admin/publisher` | 出版社削除     |

#### 書籍管理

| メソッド | エンドポイント | 説明         |
| -------- | -------------- | ------------ |
| POST     | `/admin/book`  | 書籍登録     |
| PUT      | `/admin/book`  | 書籍情報更新 |
| DELETE   | `/admin/book`  | 書籍削除     |

## 🏗 プロジェクト構造

```
NJS_Book_manager-main/
├── src/
│   ├── app.ts                 # アプリケーションエントリーポイント
│   ├── server/
│   │   └── index.ts           # サーバー設定
│   ├── route/                 # ルートハンドラー
│   │   ├── user/              # ユーザー関連
│   │   ├── book/              # 書籍関連
│   │   ├── admin/             # 管理者関連
│   │   └── search/            # 検索関連
│   ├── libs/
│   │   ├── db/                # データベース操作
│   │   ├── auth.ts            # 認証ロジック
│   │   └── validation.ts      # バリデーション
│   └── generated/
│       └── prisma/            # Prisma生成ファイル
├── prisma/
│   ├── schema.prisma          # データベーススキーマ
│   └── migrations/            # マイグレーションファイル
└── docker/
    └── compose.yaml           # Docker Compose設定
```

## 🔧 開発

### データベースマイグレーション

```bash
# マイグレーションを作成
npx prisma migrate dev --name migration_name

# マイグレーションを適用
npx prisma migrate deploy

# Prisma Studioを起動（データベースGUI）
npx prisma studio
```

### コード品質

```bash
# TypeScriptの型チェック
npx tsc --noEmit

# フォーマット
npx prettier --write .
```

## 📚 参考資料

### Passport.js

- [公式ドキュメント](https://www.passportjs.org/packages/passport-local/)
- [参考ブログ](https://torikasyu.com/?p=2171)

### Prisma

- [モデル定義](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)
- [設定リファレンス](https://www.prisma.io/docs/orm/reference/prisma-config-reference)
- [マイグレーション](https://www.prisma.io/docs/orm/prisma-migrate/getting-started)
- [PostgreSQL](https://www.prisma.io/docs/orm/overview/databases/postgresql)

## 📝 ライセンス

ISC

## 👥 作成者

s24023
