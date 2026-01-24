# デプロイガイド

## 概要

本番環境は Vercel にデプロイされています。

| 項目 | 値 |
|------|-----|
| URL | https://gakuchika-bank.com |
| Vercel Project | job-hunting-five |
| 認証 | Clerk (Production) |
| データベース | Supabase (PostgreSQL) |
| 決済 | Stripe (Test Mode) |

## 前提条件

- Vercel アカウント
- Vercel CLI (`npm i -g vercel`)
- 各サービスのアカウント設定済み

## デプロイ手順

### 1. ローカルビルド確認

デプロイ前に必ずビルドを確認:

```bash
npm run build
```

エラーがあれば修正してください。

### 2. 環境変数の設定

Vercelに環境変数を追加:

```bash
# データベース
npx vercel env add DATABASE_URL production

# Clerk
npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
npx vercel env add CLERK_SECRET_KEY production

# Stripe
npx vercel env add STRIPE_SECRET_KEY production
npx vercel env add STRIPE_WEBHOOK_SECRET production
npx vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
npx vercel env add STRIPE_PRICE_ID_STANDARD production

# LLM
npx vercel env add OPENAI_API_KEY production
npx vercel env add ANTHROPIC_API_KEY production

# App
npx vercel env add NEXT_PUBLIC_APP_URL production
# 値: https://gakuchika-bank.com
```

環境変数の確認:

```bash
npx vercel env ls production
```

### 3. デプロイ実行

```bash
# 本番デプロイ
npx vercel --prod --yes
```

### 4. 動作確認

- https://gakuchika-bank.com にアクセス
- ログイン/サインアップが動作するか
- ダッシュボードが表示されるか

## 環境変数一覧

| 変数名 | 説明 | 必須 |
|--------|------|------|
| DATABASE_URL | Supabase接続文字列 | Yes |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk公開キー | Yes |
| CLERK_SECRET_KEY | Clerkシークレット | Yes |
| STRIPE_SECRET_KEY | Stripeシークレット | Yes |
| STRIPE_WEBHOOK_SECRET | Stripe Webhook署名 | Yes |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe公開キー | Yes |
| STRIPE_PRICE_ID_STANDARD | StandardプランのPrice ID | Yes |
| OPENAI_API_KEY | OpenAI APIキー | Yes |
| ANTHROPIC_API_KEY | Anthropic APIキー | Yes |
| NEXT_PUBLIC_APP_URL | アプリURL | Yes |

## 外部サービス設定

### Clerk (本番環境)

1. Clerk Dashboard で Production インスタンスを作成
2. Configure → Paths & URLs:
   - Application URL: `https://gakuchika-bank.com`
   - Allowed origins: `https://gakuchika-bank.com`
3. DNS設定:
   - `clerk.gakuchika-bank.com` → Clerk提供のCNAME

### Stripe (本番移行時)

現在はTest Modeで運用中。本番移行時:

1. Stripe Dashboard → Settings → Go Live
2. Live API Keys を取得
3. Vercel環境変数を更新
4. Webhook エンドポイントを追加:
   - URL: `https://gakuchika-bank.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`
5. Live Webhook Secret を設定

### Supabase

1. Project Settings → Database → Connection string
2. Transaction Pooler (port 6543) を使用
3. `DATABASE_URL` に設定

## ドメイン設定

### Vercel でのドメイン追加

```bash
npx vercel domains add gakuchika-bank.com
```

### DNS設定

ドメインレジストラで以下を設定:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |
| CNAME | clerk | frontend-api.clerk.services |

### SSL

Vercel が自動でSSL証明書を発行・更新します。

## CI/CD

### GitHub連携

1. Vercel Dashboard → Settings → Git
2. GitHub リポジトリを接続
3. `main` ブランチへのpushで自動デプロイ

### Preview Deployments

PRごとにプレビュー環境が作成されます。

## トラブルシューティング

### ビルドエラー

```bash
# ログを確認
npx vercel logs --prod

# 再デプロイ
npx vercel --prod --force
```

### 環境変数の更新

```bash
# 既存の値を上書き
echo "new-value" | npx vercel env add VAR_NAME production --force

# 削除して再追加
npx vercel env rm VAR_NAME production
npx vercel env add VAR_NAME production
```

### データベース接続エラー

1. Supabase Dashboard で接続文字列を確認
2. Transaction Pooler (6543) を使用しているか確認
3. IP制限がかかっていないか確認

### Clerk認証エラー

1. Production インスタンスのキーを使用しているか確認
2. Allowed origins に `https://gakuchika-bank.com` が含まれているか確認
3. DNS設定 (`clerk.gakuchika-bank.com`) が正しいか確認

### Stripe Webhookエラー

1. Webhook署名シークレットが正しいか確認
2. エンドポイントURLが正しいか確認
3. Stripe Dashboard → Developers → Webhooks でログを確認

## ロールバック

問題が発生した場合:

```bash
# デプロイ一覧を確認
npx vercel ls

# 特定のデプロイをプロダクションに設定
npx vercel promote [deployment-url]
```

## 監視

### Vercel Analytics

Vercel Dashboard → Analytics で確認:
- ページビュー
- Web Vitals
- エラー率

### ログ

```bash
# リアルタイムログ
npx vercel logs --prod -f

# 過去のログ
npx vercel logs --prod --since 1h
```

## チェックリスト

デプロイ前:
- [ ] `npm run build` が成功する
- [ ] 環境変数がすべて設定されている
- [ ] Clerk が Production インスタンス
- [ ] DNS設定が完了している

デプロイ後:
- [ ] トップページが表示される
- [ ] ログイン/サインアップが動作する
- [ ] ダッシュボードにアクセスできる
- [ ] 経験登録ができる
- [ ] ES生成ができる
- [ ] 面接練習ができる
- [ ] 課金ページが表示される
