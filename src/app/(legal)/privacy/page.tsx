import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | ガクチカバンクAI',
  description: 'ガクチカバンクAIにおける個人情報の取扱いについて',
}

export default function PrivacyPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1>プライバシーポリシー</h1>
      
      <p className="lead">
        ガクチカバンクAI（以下「本サービス」といいます）は、ユーザーの個人情報の保護を重要な責務と認識し、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
      </p>

      <h2>1. 運営者情報</h2>
      <table>
        <tbody>
          <tr>
            <th>サービス名</th>
            <td>ガクチカバンクAI</td>
          </tr>
          <tr>
            <th>運営責任者</th>
            <td>末次 功樹</td>
          </tr>
          <tr>
            <th>お問い合わせ</th>
            <td>support@gakuchika-bank.com</td>
          </tr>
        </tbody>
      </table>

      <h2>2. 収集する情報</h2>
      <p>本サービスでは、以下の情報を収集します。</p>
      
      <h3>2.1 ユーザーが提供する情報</h3>
      <ul>
        <li><strong>アカウント情報：</strong>メールアドレス、氏名（任意）、プロフィール画像（Google認証の場合）</li>
        <li><strong>経験DB：</strong>ユーザーが入力する経験情報（STAR形式の内容、カテゴリ、期間等）</li>
        <li><strong>ES情報：</strong>生成されたエントリーシートの内容、企業名、設問等</li>
        <li><strong>面接練習データ：</strong>AIとの面接練習における質問と回答</li>
        <li><strong>お支払い情報：</strong>有料プランご利用時のクレジットカード情報（Stripeを通じて処理）</li>
      </ul>

      <h3>2.2 自動的に収集される情報</h3>
      <ul>
        <li><strong>アクセスログ：</strong>IPアドレス、ブラウザの種類、アクセス日時</li>
        <li><strong>利用状況：</strong>サービスの利用頻度、機能の利用状況</li>
        <li><strong>Cookie情報：</strong>セッション管理、サービス改善のため</li>
      </ul>

      <h2>3. 情報の利用目的</h2>
      <p>収集した情報は、以下の目的で利用します。</p>
      <ol>
        <li>本サービスの提供・運営・維持</li>
        <li>ユーザーアカウントの認証・管理</li>
        <li>ES自動生成、AI面接練習、整合性チェック等の機能提供</li>
        <li>お支払いの処理</li>
        <li>カスタマーサポートの提供</li>
        <li>サービスの改善・新機能の開発</li>
        <li>利用規約違反行為への対応</li>
        <li>本サービスに関する重要なお知らせの送信</li>
      </ol>

      <h2>4. 第三者への情報提供</h2>
      <p>本サービスでは、以下の第三者サービスを利用しており、それぞれのプライバシーポリシーに従って情報が取り扱われます。</p>

      <h3>4.1 認証サービス</h3>
      <table>
        <thead>
          <tr>
            <th>サービス名</th>
            <th>提供者</th>
            <th>送信される情報</th>
            <th>利用目的</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Clerk</td>
            <td>Clerk, Inc.</td>
            <td>メールアドレス、認証情報</td>
            <td>ユーザー認証・アカウント管理</td>
          </tr>
        </tbody>
      </table>
      <p>
        <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer">
          Clerk プライバシーポリシー
        </a>
      </p>

      <h3>4.2 決済サービス</h3>
      <table>
        <thead>
          <tr>
            <th>サービス名</th>
            <th>提供者</th>
            <th>送信される情報</th>
            <th>利用目的</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Stripe</td>
            <td>Stripe, Inc.</td>
            <td>クレジットカード情報、請求先情報</td>
            <td>決済処理・サブスクリプション管理</td>
          </tr>
        </tbody>
      </table>
      <p>
        <a href="https://stripe.com/jp/privacy" target="_blank" rel="noopener noreferrer">
          Stripe プライバシーポリシー
        </a>
      </p>

      <h3>4.3 AI・生成サービス</h3>
      <table>
        <thead>
          <tr>
            <th>サービス名</th>
            <th>提供者</th>
            <th>送信される情報</th>
            <th>利用目的</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Claude API</td>
            <td>Anthropic, PBC</td>
            <td>経験DB内容、ES生成に必要な情報、面接練習の質問・回答</td>
            <td>ES自動生成、AI面接練習、整合性チェック</td>
          </tr>
        </tbody>
      </table>
      <p>
        <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">
          Anthropic プライバシーポリシー
        </a>
      </p>
      <p className="text-sm bg-muted p-4 rounded-md">
        ※ Anthropic Claude APIは、ユーザーのデータをモデルのトレーニングに使用しません。送信されたデータは30日以内に削除されます。
      </p>

      <h3>4.4 データベース・ホスティング</h3>
      <table>
        <thead>
          <tr>
            <th>サービス名</th>
            <th>提供者</th>
            <th>送信される情報</th>
            <th>利用目的</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Supabase</td>
            <td>Supabase, Inc.</td>
            <td>全ての登録情報・コンテンツ</td>
            <td>データベースホスティング</td>
          </tr>
          <tr>
            <td>Vercel</td>
            <td>Vercel, Inc.</td>
            <td>アクセスログ</td>
            <td>Webホスティング</td>
          </tr>
        </tbody>
      </table>

      <h3>4.5 法令に基づく開示</h3>
      <p>以下の場合、法令に基づき情報を開示することがあります。</p>
      <ul>
        <li>法令に基づく場合</li>
        <li>人の生命、身体または財産の保護のために必要がある場合</li>
        <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
        <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
      </ul>

      <h2>5. 情報の保存期間</h2>
      <ul>
        <li><strong>アカウント情報：</strong>アカウント削除から30日後に削除</li>
        <li><strong>コンテンツ（経験DB、ES等）：</strong>アカウント削除から30日後に削除</li>
        <li><strong>アクセスログ：</strong>90日間保存後に自動削除</li>
        <li><strong>決済情報：</strong>Stripeのポリシーに従い保存（法令に基づく保存義務がある場合を除く）</li>
      </ul>

      <h2>6. 情報の安全管理</h2>
      <p>本サービスでは、以下のセキュリティ対策を実施しています。</p>
      <ul>
        <li>全ての通信におけるSSL/TLS暗号化</li>
        <li>データベースの暗号化保存</li>
        <li>アクセス権限の適切な管理</li>
        <li>定期的なセキュリティ監査</li>
      </ul>

      <h2>7. ユーザーの権利</h2>
      <p>ユーザーは以下の権利を有します。</p>
      <ul>
        <li><strong>アクセス権：</strong>ご自身の個人情報へのアクセス</li>
        <li><strong>訂正権：</strong>不正確な情報の訂正</li>
        <li><strong>削除権：</strong>アカウントおよび関連データの削除</li>
        <li><strong>データポータビリティ：</strong>登録データのエクスポート（設定画面から可能）</li>
      </ul>
      <p>これらの権利を行使する場合は、サービス内の設定画面から操作いただくか、下記お問い合わせ先までご連絡ください。</p>

      <h2>8. Cookieの使用</h2>
      <p>本サービスでは、以下の目的でCookieを使用しています。</p>
      <ul>
        <li><strong>必須Cookie：</strong>ログイン状態の維持、セッション管理</li>
        <li><strong>機能性Cookie：</strong>ユーザー設定の保存</li>
        <li><strong>分析Cookie：</strong>サービス利用状況の把握・改善</li>
      </ul>
      <p>ブラウザの設定によりCookieを無効にすることができますが、一部の機能が正常に動作しなくなる場合があります。</p>

      <h2>9. 未成年者のプライバシー</h2>
      <p>本サービスは、主に就職活動を行う大学生・大学院生を対象としています。18歳未満の方が本サービスを利用する場合は、保護者の同意を得た上でご利用ください。</p>

      <h2>10. プライバシーポリシーの変更</h2>
      <p>本ポリシーは、法令の改正やサービスの変更に伴い、予告なく変更されることがあります。重要な変更がある場合は、本サービス上での通知またはメールにてお知らせします。</p>

      <h2>11. お問い合わせ</h2>
      <p>本ポリシーに関するお問い合わせは、以下までご連絡ください。</p>
      <ul>
        <li><strong>メール：</strong>support@gakuchika-bank.com</li>
      </ul>

      <p className="text-sm text-muted-foreground mt-8">
        2026年2月2日 制定
      </p>
    </article>
  )
}
