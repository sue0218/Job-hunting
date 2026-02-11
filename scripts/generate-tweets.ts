/**
 * X(Twitter) 投稿自動生成スクリプト
 *
 * 実行方法: npm run generate-tweets
 * 出力先: docs/x-posts.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Tweet {
  time: string;
  content: string;
  category: string;
}

interface DaySchedule {
  date: Date;
  dayOfWeek: string;
  tweets: Tweet[];
}

// カテゴリ別のツイートテンプレート
const TWEET_TEMPLATES = {
  tips: [
    // 朝のTips（モチベーション系）
    {
      time: '8:00',
      content: `【ガクチカの書き方】
STAR形式を意識してますか？

✅ Situation（状況）
✅ Task（課題）
✅ Action（行動）
✅ Result（結果）

この順番で書くだけで、面接官に伝わるガクチカに変わります。

#27卒 #就活 #ガクチカ
https://gakuchika-bank.com`
    },
    {
      time: '8:00',
      content: `【ES作成のコツ】

「〜しました」だけで終わらせない。

✅ なぜその行動を取ったのか
✅ どんな工夫をしたのか
✅ 結果、何が変わったのか

この3つを意識するだけで説得力が10倍変わります。

#27卒 #就活 #ES
https://gakuchika-bank.com`
    },
    {
      time: '8:00',
      content: `【面接対策】

ガクチカを聞かれたとき、
「結果」だけを強調してませんか？

面接官が本当に知りたいのは：
✅ あなたの思考プロセス
✅ 困難にどう立ち向かったか
✅ そこから何を学んだか

結果は二の次です。

#27卒 #就活 #面接対策`
    },
    // 昼のTips（実践的アドバイス）
    {
      time: '12:30',
      content: `【ガクチカが思いつかない人へ】

「すごい経験」じゃなくていい。

✅ バイトでの工夫
✅ サークルでの気づき
✅ ゼミでの学び

日常の中にこそ、あなたの強みが隠れてます。

#27卒 #就活 #ガクチカ
https://gakuchika-bank.com`
    },
    {
      time: '12:30',
      content: `【文字数制限に悩んでる人へ】

400文字でまとめるコツ：

✅ 状況説明: 100文字
✅ 課題と行動: 200文字
✅ 結果と学び: 100文字

この配分を意識すると、自然とまとまります。

#27卒 #就活 #ES`
    },
    {
      time: '12:30',
      content: `【面接で深掘りされたとき】

「なぜ？」に答えられるかが勝負。

準備のコツ：
✅ ガクチカの各行動に「なぜそうしたか」を紐付ける
✅ 他の選択肢も考えておく
✅ 失敗経験も整理しておく

深掘りを恐れないガクチカを作ろう。

#27卒 #就活 #面接対策`
    },
    // 夜のTips（振り返り・整理系）
    {
      time: '20:00',
      content: `【今日のES作成、どうでした？】

書き終わったら、一度寝かせてみて。

明日読み返すと：
✅ 伝わりにくい表現に気づける
✅ 冗長な部分が見えてくる
✅ もっといい言い回しが浮かぶ

焦らず、じっくり磨き上げよう。

#27卒 #就活 #ES`
    },
    {
      time: '20:00',
      content: `【ガクチカは量より質】

10個の薄いエピソードより、
3つの深いエピソードの方が強い。

✅ STAR形式で整理
✅ 数字で具体化
✅ 学びまで言語化

まずは1つ、完璧なガクチカを作ろう。

#27卒 #就活 #ガクチカ
https://gakuchika-bank.com`
    },
  ],
  service: [
    // サービス紹介（朝）
    {
      time: '9:00',
      content: `【ガクチカバンクAI】

あなたの経験を貯めて、
AIが最適なESを自動生成。

✅ 経験をSTAR形式で保存
✅ 企業ごとにカスタマイズ
✅ 文字数制限に自動対応

就活の武器を、一緒に作りましょう。

https://gakuchika-bank.com
#27卒 #就活 #AI`
    },
    {
      time: '9:00',
      content: `【こんな人におすすめ】

✅ ガクチカが思いつかない
✅ ESの書き方がわからない
✅ 企業ごとに書き分けるのが大変

ガクチカバンクAIなら、
あなたの経験を資産として蓄積。
AIが最適な形で文章化します。

https://gakuchika-bank.com
#27卒 #就活`
    },
    // サービス紹介（昼）
    {
      time: '13:00',
      content: `【機能紹介: 経験DB】

バイト、サークル、ゼミ...
あなたの経験を一元管理。

✅ STAR形式でテンプレート化
✅ いつでも引き出せる
✅ 面接対策にも使える

経験は、あなたの資産です。

https://gakuchika-bank.com
#27卒 #就活`
    },
    {
      time: '13:00',
      content: `【機能紹介: AI ES生成】

企業の求める人物像に合わせて、
AIが自動でESをカスタマイズ。

✅ 400文字、600文字も自動調整
✅ 複数パターン生成可能
✅ 編集も自由自在

効率的に、質の高いESを。

https://gakuchika-bank.com
#27卒 #就活 #ES`
    },
    // サービス紹介（夜）
    {
      time: '21:00',
      content: `【ビフォーアフター】

Before:
「サークルで幹事長をやりました」

After:
「50名規模のサークルで幹事長として、参加率を60%→85%に向上。月1回のアンケートを導入し、メンバーのニーズを可視化。その結果、企画満足度が30%向上しました」

これ、AIが自動生成します。

https://gakuchika-bank.com
#27卒 #就活`
    },
    {
      time: '21:00',
      content: `【無料で始められます】

✅ 経験DB（無制限）
✅ ES生成（月5回まで）
✅ AI面接練習（準備中）

まずは試してみてください。
あなたの就活が、少し楽になるはずです。

https://gakuchika-bank.com
#27卒 #就活`
    },
  ],
  empathy: [
    // 共感・あるある（朝）
    {
      time: '7:30',
      content: `ES書いてると、
「これ、ほんとにすごいことなのかな...」
って不安になりますよね。

大丈夫。
あなたの経験は、あなただけのもの。

小さな工夫、小さな気づき。
それがあなたの強みです。

#27卒 #就活 #ガクチカ`
    },
    {
      time: '7:30',
      content: `「ガクチカ、何書けばいいかわからない」

これ、みんな思ってます。
あなただけじゃない。

まずは小さな経験から。
書き出してみることが、第一歩です。

#27卒 #就活`
    },
    // 共感・あるある（昼）
    {
      time: '14:00',
      content: `ES、何社書いても終わらない...

「また同じこと書いてる」
「コピペでいいかな」

その気持ち、わかります。

でも、その1社が運命の企業かもしれない。
最後まで、丁寧に向き合いましょう。

#27卒 #就活 #ES`
    },
    {
      time: '14:00',
      content: `面接で深掘りされるの、
怖いですよね。

「なぜ？」「どうして？」
「他の選択肢は？」

でも、深掘りは興味の証。
準備すれば、必ず乗り越えられます。

#27卒 #就活 #面接`
    },
    // 共感・あるある（夜）
    {
      time: '22:00',
      content: `夜、ふと不安になる。

「自分のガクチカ、弱いかも...」
「他の人の方がすごいんじゃないか」

比べなくていい。
あなたの経験は、あなただけのもの。

明日も、自分らしく頑張ろう。

#27卒 #就活`
    },
    {
      time: '22:00',
      content: `就活、疲れますよね。

ES、面接、説明会...
やることが多すぎて、息切れしそう。

たまには休んでください。
あなたの心と体が一番大事です。

#27卒 #就活`
    },
  ],
  building: [
    // Building in Public（昼・夜）
    {
      time: '15:00',
      content: `【開発者より】

ガクチカバンクAIは、
「就活生の味方」でありたいと思って作りました。

ESを何十社も書く大変さ。
ガクチカが見つからない焦り。

その悩みに、少しでも寄り添えたら。

#27卒 #就活 #BuildInPublic`
    },
    {
      time: '15:00',
      content: `【開発の裏側】

「ガクチカが書けない」
という相談をたくさん受けて、気づいたこと。

みんな、経験はあるんです。
ただ、言語化が難しいだけ。

だからAIで、その橋渡しをしたかった。

https://gakuchika-bank.com
#BuildInPublic #就活`
    },
    {
      time: '19:00',
      content: `【アップデート予定】

今後追加予定の機能：
✅ AI面接練習（音声対応）
✅ 企業研究DB連携
✅ ガクチカの強み分析

就活生の声を聞きながら、
進化させていきます。

#27卒 #就活 #BuildInPublic`
    },
    {
      time: '19:00',
      content: `【ユーザーの声】

「経験をSTAR形式で整理できて、面接対策にもなった」
「AIが書いた文章を微調整するだけで、ESが完成した」

こういう声が、開発の励みです。

まだまだ改善していきます。

https://gakuchika-bank.com
#BuildInPublic`
    },
  ],
};

// スレッドツイート（週2-3回）
const THREAD_TWEETS = [
  {
    day: 2,
    time: '10:00',
    category: 'tips',
    content: `【ガクチカの書き方 完全ガイド🧵】

27卒の就活生向けに、ES通過率を上げるガクチカの書き方をスレッドで解説します。

#27卒 #就活 #ガクチカ
(1/5)`
  },
  {
    day: 5,
    time: '11:00',
    category: 'service',
    content: `【ガクチカバンクAIの使い方🧵】

登録から5分で、あなた専用のガクチカDBが完成。
実際の使い方をスレッドで解説します。

https://gakuchika-bank.com
#27卒 #就活
(1/4)`
  },
  {
    day: 9,
    time: '10:30',
    category: 'tips',
    content: `【面接で深掘りされたときの対処法🧵】

「なぜ？」「どうして？」
面接官の深掘りに答えるコツをスレッドで解説。

#27卒 #就活 #面接対策
(1/5)`
  },
  {
    day: 12,
    time: '11:30',
    category: 'empathy',
    content: `【就活でよくある悩み Top5 🧵】

27卒の就活生から寄せられた悩みと、その解決策をスレッドで紹介します。

#27卒 #就活
(1/6)`
  },
];

/**
 * 日付をフォーマット (YYYY/MM/DD 曜日)
 */
function formatDate(date: Date): string {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayOfWeek = days[date.getDay()];
  return `${year}/${month}/${day} ${dayOfWeek}`;
}

/**
 * カテゴリから重み付きでランダム選択
 */
function selectCategory(): keyof typeof TWEET_TEMPLATES {
  const rand = Math.random();
  if (rand < 0.4) return 'tips';
  if (rand < 0.7) return 'service';
  if (rand < 0.9) return 'empathy';
  return 'building';
}

/**
 * 2週間分のツイートスケジュールを生成
 */
function generateSchedule(): DaySchedule[] {
  const schedule: DaySchedule[] = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i + 1);

    const tweets: Tweet[] = [];
    const usedTemplates = new Set<number>();

    // スレッドツイートがあるか確認
    const threadTweet = THREAD_TWEETS.find(t => t.day === i + 1);
    if (threadTweet) {
      tweets.push({
        time: threadTweet.time,
        content: threadTweet.content,
        category: threadTweet.category,
      });
    }

    // 朝・昼・夜の通常ツイートを追加（1日2-3ツイート）
    const numTweets = threadTweet ? 2 : 3; // スレッドがある日は通常ツイートを2つに

    for (let j = 0; j < numTweets; j++) {
      const category = selectCategory();
      const templates = TWEET_TEMPLATES[category];

      // 既に使用したテンプレートを避ける
      let templateIndex: number;
      let attempts = 0;
      do {
        templateIndex = Math.floor(Math.random() * templates.length);
        attempts++;
      } while (usedTemplates.has(templateIndex) && attempts < 10);

      usedTemplates.add(templateIndex);
      const template = templates[templateIndex];

      tweets.push({
        time: template.time,
        content: template.content,
        category,
      });
    }

    // 時間順にソート
    tweets.sort((a, b) => {
      const [aHour, aMin] = a.time.split(':').map(Number);
      const [bHour, bMin] = b.time.split(':').map(Number);
      return aHour * 60 + aMin - (bHour * 60 + bMin);
    });

    schedule.push({
      date,
      dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
      tweets,
    });
  }

  return schedule;
}

/**
 * Markdownファイルを生成
 */
function generateMarkdown(schedule: DaySchedule[]): string {
  let markdown = `# X (Twitter) 投稿スケジュール

> 生成日時: ${new Date().toLocaleString('ja-JP')}
> 対象期間: 2週間（14日分）

`;

  schedule.forEach((day, index) => {
    markdown += `## Day ${index + 1} (${formatDate(day.date)})\n\n`;

    day.tweets.forEach((tweet, tweetIndex) => {
      const categoryLabel = {
        tips: '就活Tips',
        service: 'サービス紹介',
        empathy: '共感・あるある',
        building: '開発者ストーリー',
      }[tweet.category];

      markdown += `### ${tweet.time} [${categoryLabel}]\n\n`;
      markdown += `> ${tweet.content.split('\n').join('\n> ')}\n\n`;

      if (tweetIndex < day.tweets.length - 1) {
        markdown += `---\n\n`;
      }
    });

    markdown += `\n`;
  });

  markdown += `---

## 運用ガイド

### 投稿のポイント

- **一貫性**: 毎日同じ時間帯に投稿することで、フォロワーの習慣を作る
- **エンゲージメント**: リプライやいいねには24時間以内に反応
- **分析**: 週1回、エンゲージメント率の高い投稿を分析し、次週に活かす

### ハッシュタグ戦略

- **必須**: #27卒 #就活
- **カテゴリ別**: #ガクチカ #ES #面接対策 #AI #BuildInPublic

### 投稿時間の理由

- **朝 (7:30-9:00)**: 通学・通勤時間、モチベーション系
- **昼 (12:30-14:00)**: 休憩時間、実践的アドバイス
- **夜 (19:00-22:00)**: 振り返り、共感系

`;

  return markdown;
}

/**
 * メイン処理
 */
function main() {
  console.log('🚀 X投稿スケジュールを生成中...\n');

  const schedule = generateSchedule();
  const markdown = generateMarkdown(schedule);

  // ファイルに書き出し
  const docsDir = path.join(__dirname, '..', 'docs');
  const outputPath = path.join(docsDir, 'x-posts.md');

  // docsディレクトリが存在しない場合は作成
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, markdown, 'utf-8');

  console.log('✅ 生成完了！');
  console.log(`📝 出力先: ${outputPath}`);
  console.log(`📊 合計: ${schedule.length}日分、${schedule.reduce((sum, day) => sum + day.tweets.length, 0)}ツイート\n`);

  // 統計情報
  const categoryCount = schedule.reduce((acc, day) => {
    day.tweets.forEach(tweet => {
      acc[tweet.category] = (acc[tweet.category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  console.log('📈 カテゴリ別内訳:');
  Object.entries(categoryCount).forEach(([category, count]) => {
    const label = {
      tips: '就活Tips',
      service: 'サービス紹介',
      empathy: '共感・あるある',
      building: '開発者ストーリー',
    }[category];
    console.log(`  - ${label}: ${count}ツイート`);
  });
}

main();
