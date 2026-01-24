# アーキテクチャ

## システム概要

ガクチカバンクAIは、Next.js App Routerをベースとしたフルスタックアプリケーションです。

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Landing Page│  │ Dashboard   │  │ Interview Practice  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Server      │  │ API Routes  │  │ Server Actions      │  │
│  │ Components  │  │ (Webhooks)  │  │ (Mutations)         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│    Clerk      │  │   Supabase    │  │  LLM APIs     │
│ (認証)        │  │ (PostgreSQL)  │  │ (OpenAI/      │
│               │  │               │  │  Anthropic)   │
└───────────────┘  └───────────────┘  └───────────────┘
```

## 技術選定理由

### Next.js 16 (App Router)

- **Server Components**: データフェッチをサーバーサイドで完結
- **Server Actions**: フォーム処理の簡素化
- **Streaming**: 大きなレスポンスの段階的表示

### Drizzle ORM

- **TypeScript First**: スキーマから型が自動生成
- **軽量**: バンドルサイズが小さい
- **SQL-like**: SQLに近い直感的なAPI

### Clerk

- **マネージド認証**: セキュリティリスクを軽減
- **Webhook**: ユーザーイベントをDBに同期
- **UI Components**: 認証UIがすぐ使える

### Stripe

- **サブスクリプション対応**: 定額課金に最適
- **Checkout**: ホスティングされた決済ページ
- **Webhook**: 支払いイベントをリアルタイム処理

## レイヤー構成

```
src/
├── app/                    # Presentation Layer
│   ├── (auth)/            # 認証ページ（Route Group）
│   ├── (dashboard)/       # ダッシュボード（Route Group）
│   └── api/               # API Routes
│
├── components/            # UI Components
│   ├── layout/           # レイアウト部品
│   ├── providers/        # Context Providers
│   └── ui/               # shadcn/ui（プリミティブ）
│
└── lib/                   # Business Logic Layer
    ├── actions/          # Server Actions（Use Cases）
    ├── db/               # Data Access Layer
    ├── llm/              # LLM Integration
    ├── quota/            # 利用制限ロジック
    └── stripe/           # Stripe Integration
```

## Route Groups

Next.js App Routerの Route Groups を活用してレイアウトを分離:

- `(auth)`: 認証ページ用レイアウト（サイドバーなし）
- `(dashboard)`: ダッシュボード用レイアウト（サイドバーあり、認証必須）

## データフロー

### 1. 経験登録

```
User Input → Server Action → Validation (Zod) → Drizzle → PostgreSQL
```

### 2. ES生成

```
User Request → Server Action → Experience Fetch → LLM Prompt →
OpenAI/Anthropic → Response Parse → Save to DB → Return to Client
```

### 3. 面接練習

```
User Response → Server Action → Context Build (Experience + History) →
LLM Prompt → OpenAI/Anthropic → Parse Feedback → Save Turn → Return
```

### 4. 課金フロー

```
User Click → Create Checkout Session → Redirect to Stripe →
Payment Complete → Webhook → Update User Plan → Redirect Back
```

## 認証フロー

```
1. User accesses protected route
2. Clerk middleware checks auth
3. If not authenticated → redirect to /sign-in
4. Clerk handles authentication
5. On success → redirect to /dashboard
6. Clerk Webhook → sync user to database
```

## LLM統合

### プロバイダー抽象化

```typescript
// lib/llm/providers.ts
interface LLMProvider {
  generateES(prompt: string): Promise<string>
  generateInterviewResponse(context: InterviewContext): Promise<InterviewResponse>
}

class OpenAIProvider implements LLMProvider { ... }
class AnthropicProvider implements LLMProvider { ... }
```

### プロンプト管理

```
lib/llm/
├── prompts/
│   ├── es-generation.ts      # ES生成プロンプト
│   └── interview.ts          # 面接プロンプト
└── providers.ts              # プロバイダー実装
```

## 利用制限（Quota）

フリープランの利用制限を管理:

```typescript
// lib/quota/check.ts
async function checkQuota(userId: string, type: QuotaType): Promise<QuotaResult> {
  // 1. ユーザープランを取得
  // 2. 今月の利用回数を取得
  // 3. 制限と比較
  // 4. 結果を返す
}
```

### 制限値

| 機能 | Free | Standard |
|------|------|----------|
| 経験登録 | 3/月 | 無制限 |
| ES生成 | 5/月 | 無制限 |
| 面接練習 | 3/月 | 無制限 |

## エラーハンドリング

### Server Actions

```typescript
// lib/actions/experiences.ts
export async function createExperience(data: CreateExperienceInput) {
  try {
    // バリデーション
    const validated = createExperienceSchema.parse(data)

    // 認証チェック
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    // クオータチェック
    const quota = await checkQuota(userId, 'experience_create')
    if (!quota.allowed) throw new Error('Quota exceeded')

    // 実行
    const result = await db.insert(experiences).values(validated)
    return { success: true, data: result }

  } catch (error) {
    logger.error('createExperience failed', { error })
    return { success: false, error: error.message }
  }
}
```

### クライアントサイド

```typescript
// components/experiences/create-form.tsx
const result = await createExperience(data)
if (result.success) {
  toast.success('経験を登録しました')
  router.push('/experiences')
} else {
  toast.error(result.error || '登録に失敗しました')
}
```

## パフォーマンス最適化

### 1. Server Components

データフェッチをサーバーで完結させ、クライアントへのJSを削減:

```tsx
// app/(dashboard)/experiences/page.tsx
export default async function ExperiencesPage() {
  const experiences = await getExperiences() // サーバーで実行
  return <ExperienceList experiences={experiences} />
}
```

### 2. Streaming

LLMの長いレスポンスをストリーミング:

```tsx
// 面接練習のレスポンス
const stream = await llm.stream(prompt)
for await (const chunk of stream) {
  // 段階的に表示
}
```

### 3. キャッシング

同一プロンプトの結果をキャッシュ:

```typescript
// lib/llm/cache.ts
const cached = await generationCache.findOne({ cacheKey })
if (cached && !isExpired(cached)) {
  return cached.content
}
```

## セキュリティ

### 1. 認証

- Clerk による認証管理
- すべての Server Action で認証チェック
- Middleware でルート保護

### 2. 入力検証

- Zod によるスキーマバリデーション
- SQLインジェクション対策（Drizzle ORM）

### 3. API保護

- Rate Limiting
- CORS設定
- Webhook署名検証

### 4. 環境変数

- シークレットはサーバーサイドのみ
- `NEXT_PUBLIC_` プレフィックスで公開範囲を制御

## 監視・ログ

### ログ出力

```typescript
// lib/logger.ts
import { eventLogs } from './db/schema'

export async function logEvent(
  eventType: string,
  eventData: object,
  userId?: string
) {
  await db.insert(eventLogs).values({
    eventType,
    eventData,
    userId,
  })
}
```

### イベント種別

- `user.created` - ユーザー作成
- `experience.created` - 経験登録
- `es.generated` - ES生成
- `interview.completed` - 面接完了
- `subscription.created` - サブスクリプション開始
