# CLAUDE.md - AI開発ガイド

このファイルは Claude Code での開発時に参照される指示書です。

## プロジェクト概要

- **名前**: ガクチカバンクAI
- **説明**: 就活生向けAI支援SaaS（経験DB、ES生成、AI面接練習）
- **URL**: https://gakuchika-bank.com
- **言語**: 日本語優先

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS 4 |
| UI | shadcn/ui (Radix UI) |
| 認証 | Clerk |
| DB | PostgreSQL (Supabase) |
| ORM | Drizzle ORM |
| 決済 | Stripe |
| LLM | OpenAI GPT-4 / Anthropic Claude |
| デプロイ | Vercel |

## ディレクトリ構成

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証ページ（Route Group）
│   ├── (dashboard)/       # ダッシュボード（Route Group）
│   └── api/               # API Routes（Webhooks）
├── components/
│   ├── layout/            # サイドバー、ヘッダー
│   ├── providers/         # Clerk Provider等
│   └── ui/                # shadcn/ui コンポーネント
└── lib/
    ├── actions/           # Server Actions
    ├── db/                # schema.ts, drizzle設定
    ├── llm/               # LLM統合、プロンプト
    ├── quota/             # 利用制限管理
    └── stripe/            # Stripe統合
```

## コマンド

```bash
npm run dev          # 開発サーバー
npm run build        # ビルド
npm run lint         # ESLint
npm run db:push      # スキーマ反映
npm run db:studio    # Drizzle Studio
npx vercel --prod    # 本番デプロイ
```

## コーディング規約

### Server Actions

```typescript
// lib/actions/xxx.ts
'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function createSomething(data: CreateInput) {
  // 1. 認証チェック
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // 2. バリデーション
  const validated = schema.parse(data)

  // 3. 実行
  const result = await db.insert(table).values(validated)

  // 4. 結果を返す
  return { success: true, data: result }
}
```

### コンポーネント

- Server Components をデフォルトで使用
- インタラクティブな部分のみ `'use client'`
- shadcn/ui コンポーネントを活用

### スタイリング

- Tailwind CSS のユーティリティクラスを使用
- カスタムカラーは `globals.css` の CSS変数を参照
- 主要カラー: `primary` (青), `destructive` (赤)

## 重要ファイル

| ファイル | 説明 |
|---------|------|
| `src/lib/db/schema.ts` | データベーススキーマ |
| `src/lib/actions/` | ビジネスロジック（Server Actions） |
| `src/lib/llm/` | LLM統合コード |
| `src/lib/quota/` | 利用制限ロジック |
| `src/app/globals.css` | グローバルスタイル、CSS変数 |
| `drizzle.config.ts` | Drizzle ORM設定 |

## データベース

### 主要テーブル

- `users` - ユーザー（Clerkと同期）
- `experiences` - 経験DB（STAR形式）
- `esDocuments` - ES文書
- `interviewSessions` - 面接セッション
- `interviewTurns` - 面接会話
- `quotaUsage` - 利用量記録

### スキーマ変更時

```bash
# 1. schema.ts を編集
# 2. DBに反映
npm run db:push
```

## 認証

Clerk を使用:

```typescript
import { auth, currentUser } from '@clerk/nextjs/server'

// Server Action / API Route
const { userId } = await auth()

// ユーザー情報取得
const user = await currentUser()
```

## LLM統合

```typescript
import { generateES } from '@/lib/llm/providers'

const content = await generateES({
  experiences: selectedExperiences,
  question: esQuestion,
  charLimit: 400,
})
```

## 決済

Stripe Checkout を使用:

```typescript
import { createCheckoutSession } from '@/lib/stripe'

const { url } = await createCheckoutSession({
  userId,
  priceId: process.env.STRIPE_PRICE_ID_STANDARD,
})
```

## 利用制限

```typescript
import { checkQuota } from '@/lib/quota'

const quota = await checkQuota(userId, 'es_generation')
if (!quota.allowed) {
  throw new Error('利用上限に達しました')
}
```

## 環境変数

`.env.local` に設定（`.env.example` 参照）:

- `DATABASE_URL` - Supabase接続
- `CLERK_*` - 認証
- `STRIPE_*` - 決済
- `OPENAI_API_KEY` - ES生成・面接AI
- `ANTHROPIC_API_KEY` - バックアップLLM

## デプロイ

```bash
# ビルド確認
npm run build

# 本番デプロイ
npx vercel --prod --yes
```

## 注意事項

1. **セキュリティ**
   - Server Actions で必ず認証チェック
   - 環境変数をクライアントに露出しない

2. **パフォーマンス**
   - Server Components を活用
   - LLMレスポンスはストリーミング対応

3. **エラーハンドリング**
   - try-catch で適切にエラー処理
   - ユーザーにわかりやすいメッセージを表示

## トラブルシューティング

### DB接続エラー

- `DATABASE_URL` が正しいか確認
- Supabase の Transaction Pooler (port 6543) を使用

### Clerk認証エラー

- Production インスタンスのキーを使用しているか確認
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` が `pk_live_` で始まるか確認

### LLM APIエラー

- APIキーが有効か確認
- レート制限に達していないか確認

## 参考ドキュメント

- [アーキテクチャ](docs/ARCHITECTURE.md)
- [データベース](docs/DATABASE.md)
- [デプロイ](docs/DEPLOYMENT.md)
