import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | ガクチカバンクAI',
  description: 'ガクチカバンクAIの特定商取引法に基づく表記',
}

export default function TokushohoPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1>特定商取引法に基づく表記</h1>
      
      <table className="not-prose w-full border-collapse">
        <tbody className="divide-y">
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 w-1/3 align-top">販売事業者名</th>
            <td className="py-4 px-4">末次 功樹（個人事業主）</td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">運営責任者</th>
            <td className="py-4 px-4">末次 功樹</td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">所在地</th>
            <td className="py-4 px-4">
              請求があった場合には遅滞なく開示いたします。<br />
              <span className="text-sm text-muted-foreground">
                ※ 個人事業のため、プライバシー保護の観点から非公開としております。
              </span>
            </td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">電話番号</th>
            <td className="py-4 px-4">
              請求があった場合には遅滞なく開示いたします。<br />
              <span className="text-sm text-muted-foreground">
                ※ お問い合わせはメールにてお願いいたします。
              </span>
            </td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">メールアドレス</th>
            <td className="py-4 px-4">support@gakuchika-bank.com</td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">サービス名</th>
            <td className="py-4 px-4">ガクチカバンクAI</td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">サービスURL</th>
            <td className="py-4 px-4">
              <a href="https://gakuchika-bank.com" className="text-primary hover:underline">
                https://gakuchika-bank.com
              </a>
            </td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">販売価格</th>
            <td className="py-4 px-4">
              <ul className="list-disc list-inside space-y-1 mb-0">
                <li>無料プラン：0円</li>
                <li>スタンダードプラン：月額1,980円（税込）</li>
              </ul>
              <span className="text-sm text-muted-foreground">
                ※ 価格は予告なく変更される場合があります。
              </span>
            </td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">販売価格以外にかかる費用</th>
            <td className="py-4 px-4">
              インターネット接続料金、通信料金等はお客様のご負担となります。
            </td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">支払い方法</th>
            <td className="py-4 px-4">
              クレジットカード決済（Visa、Mastercard、American Express、JCB等）<br />
              <span className="text-sm text-muted-foreground">
                ※ 決済処理はStripe, Inc.が行います。
              </span>
            </td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">支払い時期</th>
            <td className="py-4 px-4">
              お申し込み時に初回のお支払いが発生し、以降は毎月同日に自動更新されます。
            </td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">サービス提供時期</th>
            <td className="py-4 px-4">
              お支払い完了後、即時にサービスをご利用いただけます。
            </td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">返品・キャンセルについて</th>
            <td className="py-4 px-4">
              <p className="mb-2">
                デジタルコンテンツの性質上、サービス提供開始後の返金はお受けしておりません。
              </p>
              <p className="mb-2">
                <strong>解約について：</strong>いつでも解約可能です。解約手続きを行った場合、次回更新日をもってサービスが終了します。解約日から次回更新日までの期間は引き続きサービスをご利用いただけます。日割りでの返金は行っておりません。
              </p>
              <p className="mb-0">
                <strong>解約方法：</strong>設定画面の「プラン・課金」から解約手続きを行えます。
              </p>
            </td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-4 text-left bg-muted/50 align-top">動作環境</th>
            <td className="py-4 px-4">
              <p className="mb-2"><strong>推奨ブラウザ：</strong></p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                <li>Google Chrome（最新版）</li>
                <li>Mozilla Firefox（最新版）</li>
                <li>Safari（最新版）</li>
                <li>Microsoft Edge（最新版）</li>
              </ul>
              <p className="mb-0 text-sm text-muted-foreground">
                ※ 上記以外のブラウザや古いバージョンでは、正常に動作しない場合があります。
              </p>
            </td>
          </tr>
          <tr>
            <th className="py-4 px-4 text-left bg-muted/50 align-top">その他</th>
            <td className="py-4 px-4">
              サービスの利用にあたっては、
              <a href="/terms" className="text-primary hover:underline">利用規約</a>
              および
              <a href="/privacy" className="text-primary hover:underline">プライバシーポリシー</a>
              に同意いただく必要があります。
            </td>
          </tr>
        </tbody>
      </table>

      <p className="text-sm text-muted-foreground mt-8">
        2026年2月2日 制定
      </p>
    </article>
  )
}
