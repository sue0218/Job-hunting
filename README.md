# ガクチカバンクAI

経験を資産に、ESも面接もブレない就活

## 概要

ガクチカバンクAIは、就活生向けのAI支援SaaSプロダクトです。STAR形式で経験（ガクチカ）を一度登録すれば、何社でも使い回せるES生成、AI面接練習、整合性チェックを提供します。

### 主な機能

- **経験DB（ガクチカバンク）**: STAR形式で経験を構造化して保存
- **ES生成**: 登録した経験をもとにAIがエントリーシートを自動生成
- **面接練習**: 4種類の面接官タイプ（標準・フレンドリー・厳格・論理的）によるAI面接
- **整合性チェック**: ESと経験DBの矛盾を自動検出

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS 4 |
| UIコンポーネント | shadcn/ui (Radix UI) |
| 認証 | Clerk |
| データベース | PostgreSQL (Supabase) |
| ORM | Drizzle ORM |
| 決済 | Stripe |
| LLM | OpenAI GPT-4 / Anthropic Claude |
| デプロイ | Vercel |

## ディレクトリ構成

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ページ
│   │   ├── sign-in/       # ログイン
│   │   └── sign-up/       # 新規登録
│   ├── (dashboard)/       # ダッシュボード（認証必須）
│   │   ├── billing/       # 課金・プラン
│   │   ├── dashboard/     # ダッシュボード
│   │   ├── es/            # ES作成・一覧
│   │   ├── experiences/   # 経験DB
│   │   ├── interview/     # 面接練習
│   │   └── settings/      # 設定
│   ├── api/               # APIルート
│   │   └── webhooks/      # Stripe Webhook
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ランディングページ
├── components/
│   ├── layout/            # レイアウトコンポーネント
│   ├── providers/         # Context Provider
│   └── ui/                # shadcn/ui コンポーネント
└── lib/
    ├── actions/           # Server Actions
    ├── config/            # 設定ファイル
    ├── db/                # データベース関連
    ├── llm/               # LLM統合
    ├── quota/             # 利用制限管理
    ├── rate-limit/        # レート制限
    ├── stripe/            # Stripe関連
    └── validations/       # Zodスキーマ
```

## セットアップ

### 前提条件

- Node.js 20.x 以上
- npm 10.x 以上
- PostgreSQL データベース（Supabase推奨）

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-repo/gakuchika-bank-ai.git
cd gakuchika-bank-ai
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成:

```bash
cp .env.example .env.local
```

以下の環境変数を設定:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_STANDARD_PRICE_ID=price_xxx

# LLM
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. データベースのセットアップ

```bash
# スキーマをデータベースにプッシュ
npm run db:push

# （オプション）Drizzle Studioでデータを確認
npm run db:studio
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリにアクセス。

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | ESLintチェック |
| `npm run db:push` | スキーマをDBに反映 |
| `npm run db:generate` | マイグレーションファイル生成 |
| `npm run db:migrate` | マイグレーション実行 |
| `npm run db:studio` | Drizzle Studio起動 |

## プラン・制限

| 機能 | Free | Standard |
|------|------|----------|
| 経験登録 | 3件/月 | 無制限 |
| ES生成 | 5回/月 | 無制限 |
| 面接練習 | 3回/月 | 無制限 |
| 整合性チェック | 有り | 有り |

## 外部サービス設定

### Clerk（認証）

1. [Clerk Dashboard](https://dashboard.clerk.com/) でアプリケーション作成
2. Publishable Key と Secret Key を取得
3. 本番環境では「Production」インスタンスを作成

### Supabase（データベース）

1. [Supabase](https://supabase.com/) でプロジェクト作成
2. Settings → Database → Connection string からURLを取得
3. Transaction Pooler の接続文字列（port 6543）を使用

### Stripe（決済）

1. [Stripe Dashboard](https://dashboard.stripe.com/) でアカウント作成
2. Developers → API keys でキーを取得
3. Webhooksエンドポイントを追加: `https://your-domain.com/api/webhooks/stripe`
4. イベント: `checkout.session.completed`, `customer.subscription.*`

## デプロイ

### Vercel

```bash
# Vercel CLIでデプロイ
npx vercel --prod

# 環境変数の設定
npx vercel env add DATABASE_URL production
npx vercel env add CLERK_SECRET_KEY production
# ... 他の環境変数も同様
```

詳細は [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) を参照。

## ドキュメント

- [アーキテクチャ](docs/ARCHITECTURE.md) - システム設計の詳細
- [データベース](docs/DATABASE.md) - スキーマとリレーション
- [デプロイ](docs/DEPLOYMENT.md) - 本番環境へのデプロイ手順
- [CLAUDE.md](CLAUDE.md) - AI支援開発ガイド

## 本番環境

- **URL**: https://gakuchika-bank.com
- **Vercel Project**: job-hunting-five
- **Clerk**: Production instance
- **Stripe**: Test mode（本番移行時にLiveモードへ切替）

## ライセンス

Private - All Rights Reserved

## 作者

ガクチカバンクAI チーム
