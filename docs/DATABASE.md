# データベース設計

## 概要

PostgreSQL (Supabase) を使用し、Drizzle ORM でアクセス。

## ER図

```
┌──────────────┐
│    users     │
├──────────────┤
│ id (PK)      │
│ clerkId      │──────────────────────────────────────────────┐
│ email        │                                              │
│ name         │                                              │
│ plan         │                                              │
│ stripeCustom │                                              │
│ stripeSubscr │                                              │
└──────┬───────┘                                              │
       │                                                      │
       │ 1:N                                                  │
       │                                                      │
       ├────────────────────┬───────────────────┬────────────┤
       ▼                    ▼                   ▼            │
┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│ experiences  │    │ esDocuments  │    │interviewSess │     │
├──────────────┤    ├──────────────┤    ├──────────────┤     │
│ id (PK)      │    │ id (PK)      │    │ id (PK)      │     │
│ userId (FK)  │    │ userId (FK)  │    │ userId (FK)  │     │
│ title        │    │ title        │    │ title        │     │
│ category     │    │ companyName  │    │ type         │     │
│ periodStart  │    │ question     │    │interviewerTy │     │
│ periodEnd    │    │ charLimit    │    │ companyName  │     │
│ situation    │    │ generatedCnt │    │ experienceId │     │
│ task         │    │ editedContent│    │ status       │     │
│ action       │    │ experienceIds│    │ feedback     │     │
│ result       │    │ status       │    │ rating       │     │
│ skills       │    └──────────────┘    └──────┬───────┘     │
│ rawNotes     │                               │              │
└──────────────┘                               │ 1:N          │
                                               │              │
                                               ▼              │
                                       ┌──────────────┐       │
                                       │interviewTurns│       │
                                       ├──────────────┤       │
                                       │ id (PK)      │       │
                                       │ sessionId(FK)│       │
                                       │ turnNumber   │       │
                                       │ interviewer  │       │
                                       │ userResponse │       │
                                       │ feedback     │       │
                                       └──────────────┘       │
                                                              │
┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│ quotaUsage   │    │ eventLogs    │    │ featureFlags │      │
├──────────────┤    ├──────────────┤    ├──────────────┤      │
│ id (PK)      │    │ id (PK)      │    │ id (PK)      │      │
│ userId (FK) ◄┴────┤ userId       │    │ name         │      │
│ usageType    │    │ eventType    │    │ enabled      │      │
│ usageDate    │    │ eventData    │    │ rules        │      │
│ count        │    └──────────────┘    └──────────────┘      │
└──────────────┘                                              │
                                                              │
┌──────────────┐    ┌──────────────┐                          │
│ consistency  │    │ generation   │                          │
│ Checks       │    │ Cache        │                          │
├──────────────┤    ├──────────────┤                          │
│ id (PK)      │    │ id (PK)      │                          │
│ userId (FK) ◄┴────┤ cacheKey     │                          │
│ targetType   │    │ content      │                          │
│ targetId     │    │ promptVersio │                          │
│ issues       │    │ llmProvider  │                          │
└──────────────┘    │ expiresAt    │                          │
                    └──────────────┘                          │
```

## テーブル定義

### users

ユーザー情報（Clerkと同期）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | Primary Key |
| clerkId | TEXT | Clerk ユーザーID（UNIQUE） |
| email | TEXT | メールアドレス |
| name | TEXT | 表示名 |
| plan | TEXT | プラン（free/standard） |
| stripeCustomerId | TEXT | Stripe 顧客ID |
| stripeSubscriptionId | TEXT | Stripe サブスクリプションID |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |

### experiences

経験DB（ガクチカ）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | Primary Key |
| userId | UUID | ユーザーID (FK → users.id) |
| title | TEXT | 経験タイトル |
| category | TEXT | カテゴリ（部活、バイト、研究等） |
| periodStart | DATE | 開始時期 |
| periodEnd | DATE | 終了時期 |
| situation | TEXT | STAR: Situation（状況） |
| task | TEXT | STAR: Task（課題） |
| action | TEXT | STAR: Action（行動） |
| result | TEXT | STAR: Result（結果） |
| skills | TEXT[] | 身についたスキル（タグ形式） |
| rawNotes | TEXT | 自由記述メモ |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |

### esDocuments

エントリーシート

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | Primary Key |
| userId | UUID | ユーザーID (FK → users.id) |
| title | TEXT | ドキュメントタイトル |
| companyName | TEXT | 企業名 |
| question | TEXT | 設問文 |
| charLimit | INTEGER | 文字数制限 |
| generatedContent | TEXT | AI生成コンテンツ |
| editedContent | TEXT | 編集後コンテンツ |
| experienceIds | UUID[] | 参照した経験ID |
| promptVersion | TEXT | 使用プロンプトバージョン |
| llmProvider | TEXT | 使用LLM（openai/anthropic） |
| llmModel | TEXT | 使用モデル |
| status | TEXT | ステータス（draft/final） |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |

### interviewSessions

面接練習セッション

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | Primary Key |
| userId | UUID | ユーザーID (FK → users.id) |
| title | TEXT | セッションタイトル |
| type | TEXT | 面接タイプ（general/experience/company） |
| interviewerType | TEXT | 面接官タイプ（standard/friendly/strict/logical） |
| companyName | TEXT | 企業名 |
| position | TEXT | 志望職種 |
| experienceId | UUID | 単一経験ID |
| experienceIds | UUID[] | 複数経験ID |
| esDocumentIds | UUID[] | 参照ES ID |
| status | TEXT | ステータス（in_progress/completed） |
| feedback | TEXT | 総合フィードバック |
| rating | INTEGER | 評価（1-5） |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |

### interviewTurns

面接会話ターン

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | Primary Key |
| sessionId | UUID | セッションID (FK → interviewSessions.id) |
| turnNumber | INTEGER | ターン番号 |
| interviewerMessage | TEXT | 面接官の質問 |
| userResponse | TEXT | ユーザーの回答 |
| feedback | TEXT | ターンごとのフィードバック |
| createdAt | TIMESTAMP | 作成日時 |

### consistencyChecks

整合性チェック結果

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | Primary Key |
| userId | UUID | ユーザーID (FK → users.id) |
| targetType | TEXT | チェック対象タイプ（es/interview） |
| targetId | UUID | チェック対象ID |
| issues | JSONB | 検出された矛盾（配列） |
| createdAt | TIMESTAMP | 作成日時 |

### quotaUsage

利用量記録（消費台帳）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | Primary Key |
| userId | UUID | ユーザーID (FK → users.id) |
| usageType | TEXT | 利用タイプ（es_generation/interview_session/experience_create） |
| usageDate | DATE | 利用日 |
| count | INTEGER | 利用回数 |
| createdAt | TIMESTAMP | 作成日時 |

### generationCache

LLM生成キャッシュ

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | Primary Key |
| cacheKey | TEXT | キャッシュキー（UNIQUE） |
| content | TEXT | キャッシュコンテンツ |
| promptVersion | TEXT | プロンプトバージョン |
| llmProvider | TEXT | LLMプロバイダー |
| llmModel | TEXT | LLMモデル |
| createdAt | TIMESTAMP | 作成日時 |
| expiresAt | TIMESTAMP | 有効期限 |

### eventLogs

イベントログ

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | Primary Key |
| userId | UUID | ユーザーID（nullable） |
| eventType | TEXT | イベントタイプ |
| eventData | JSONB | イベントデータ |
| createdAt | TIMESTAMP | 作成日時 |

### featureFlags

機能フラグ

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | Primary Key |
| name | TEXT | フラグ名（UNIQUE） |
| enabled | BOOLEAN | 有効/無効 |
| rules | JSONB | 適用ルール |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |

## インデックス

### 推奨インデックス

```sql
-- ユーザー検索
CREATE INDEX idx_users_clerk_id ON users(clerk_id);

-- 経験一覧取得
CREATE INDEX idx_experiences_user_id ON experiences(user_id);

-- ES一覧取得
CREATE INDEX idx_es_documents_user_id ON es_documents(user_id);

-- 面接セッション一覧
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);

-- 面接ターン取得
CREATE INDEX idx_interview_turns_session_id ON interview_turns(session_id);

-- 利用量集計
CREATE INDEX idx_quota_usage_user_date ON quota_usage(user_id, usage_date);

-- キャッシュ検索
CREATE INDEX idx_generation_cache_key ON generation_cache(cache_key);
```

## マイグレーション

### スキーマ反映

```bash
# スキーマをDBに直接反映（開発用）
npm run db:push

# マイグレーションファイル生成
npm run db:generate

# マイグレーション実行
npm run db:migrate
```

### Drizzle Studio

```bash
# GUIでデータ確認・編集
npm run db:studio
```

## Supabase接続設定

### 接続文字列

```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### ポート

- **5432**: Direct connection（開発用）
- **6543**: Transaction Pooler（本番推奨）

### 接続プール

Supabase の Transaction Pooler を使用することで:
- コネクション数の制限を回避
- サーバーレス環境に最適化

## バックアップ

Supabase Dashboard > Database > Backups から自動バックアップを確認。

手動バックアップ:
```bash
pg_dump -h db.[project-ref].supabase.co -U postgres -d postgres > backup.sql
```
