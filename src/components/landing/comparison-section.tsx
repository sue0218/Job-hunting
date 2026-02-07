import { Check, X, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ComparisonSection() {
  const features = [
    { name: "経験DB", ours: true, es: false, interview: false, chatgpt: false },
    { name: "ES生成", ours: true, es: true, interview: false, chatgpt: true },
    { name: "面接練習", ours: true, es: false, interview: true, chatgpt: true },
    { name: "整合性チェック", ours: true, es: false, interview: false, chatgpt: false },
    { name: "STAR形式", ours: true, es: false, interview: false, chatgpt: false },
    { name: "一気通貫", ours: true, es: false, interview: false, chatgpt: false },
  ];

  return (
    <section className="py-20 sm:py-28 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            他の就活AIとの違い
          </h2>
          <p className="text-lg text-slate-300">
            すべての機能が揃う唯一のサービス
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block max-w-5xl mx-auto mb-16">
          <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-6 text-slate-300 font-medium">機能</th>
                  <th className="p-6 text-center">
                    <div className="text-white font-bold text-lg border-2 border-primary rounded-lg py-2 px-4 bg-primary/10">
                      ガクチカバンクAI
                    </div>
                  </th>
                  <th className="p-6 text-center text-slate-300 font-medium">
                    ES生成AI
                    <div className="text-xs text-slate-500 font-normal mt-1">SmartES等</div>
                  </th>
                  <th className="p-6 text-center text-slate-300 font-medium">
                    面接AI
                    <div className="text-xs text-slate-500 font-normal mt-1">面接練習アプリ</div>
                  </th>
                  <th className="p-6 text-center text-slate-300 font-medium">
                    ChatGPT
                    <div className="text-xs text-slate-500 font-normal mt-1">汎用AI</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={feature.name}
                    className={`border-b border-slate-700 hover:bg-slate-750 transition-colors ${
                      index === features.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="p-6 text-slate-200 font-medium">{feature.name}</td>
                    <td className="p-6 text-center bg-primary/5">
                      {feature.ours ? (
                        <Check className="h-6 w-6 text-primary mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {feature.es ? (
                        <Check className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {feature.interview ? (
                        <Check className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {feature.chatgpt ? (
                        <Check className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-slate-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 mb-16">
          {/* Ours */}
          <Card className="border-primary border-2 bg-slate-800">
            <CardHeader>
              <CardTitle className="text-white">ガクチカバンクAI</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2">
                    {feature.ours ? (
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-slate-600 flex-shrink-0" />
                    )}
                    <span className="text-slate-200">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* ES AI */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                ES生成AI
                <span className="text-sm text-slate-400 font-normal ml-2">SmartES等</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2">
                    {feature.es ? (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-slate-600 flex-shrink-0" />
                    )}
                    <span className="text-slate-200">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Interview AI */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                面接AI
                <span className="text-sm text-slate-400 font-normal ml-2">面接練習アプリ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2">
                    {feature.interview ? (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-slate-600 flex-shrink-0" />
                    )}
                    <span className="text-slate-200">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* ChatGPT */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                ChatGPT
                <span className="text-sm text-slate-400 font-normal ml-2">汎用AI</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2">
                    {feature.chatgpt ? (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-slate-600 flex-shrink-0" />
                    )}
                    <span className="text-slate-200">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* ChatGPT Time Comparison */}
        <div className="max-w-5xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            作業時間の違い
          </h3>
          <div className="grid gap-8 md:grid-cols-2">
            {/* ChatGPT Card */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-400" />
                  ChatGPTで同じことをやると...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 mb-6">
                  <li className="flex gap-3 text-slate-300">
                    <span className="text-slate-500 font-medium">1.</span>
                    <span>経験をテキストで毎回コピペ（10分）</span>
                  </li>
                  <li className="flex gap-3 text-slate-300">
                    <span className="text-slate-500 font-medium">2.</span>
                    <span>企業情報を調べて入力（15分）</span>
                  </li>
                  <li className="flex gap-3 text-slate-300">
                    <span className="text-slate-500 font-medium">3.</span>
                    <span>プロンプトを試行錯誤（20分）</span>
                  </li>
                  <li className="flex gap-3 text-slate-300">
                    <span className="text-slate-500 font-medium">4.</span>
                    <span>面接練習用に別のプロンプト作成（15分）</span>
                  </li>
                  <li className="flex gap-3 text-slate-300">
                    <span className="text-slate-500 font-medium">5.</span>
                    <span>ES-面接の矛盾を手動チェック（20分）</span>
                  </li>
                </ol>
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-destructive font-bold text-xl">
                    合計80分/社
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Our Service Card */}
            <Card className="bg-slate-800 border-primary border-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  ガクチカバンクAIなら...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 mb-6">
                  <li className="flex gap-3 text-slate-300">
                    <span className="text-primary font-medium">1.</span>
                    <span>経験を一度登録（初回のみ20分）</span>
                  </li>
                  <li className="flex gap-3 text-slate-300">
                    <span className="text-primary font-medium">2.</span>
                    <span>企業名とES設問を入力（2分）</span>
                  </li>
                  <li className="flex gap-3 text-slate-300">
                    <span className="text-primary font-medium">3.</span>
                    <span>AIが自動生成（30秒）</span>
                  </li>
                  <li className="flex gap-3 text-slate-300">
                    <span className="text-primary font-medium">4.</span>
                    <span>同じ経験で面接練習（5分）</span>
                  </li>
                  <li className="flex gap-3 text-slate-300">
                    <span className="text-primary font-medium">5.</span>
                    <span>矛盾を自動検出（自動）</span>
                  </li>
                </ol>
                <div className="pt-4 border-t border-primary/30">
                  <p className="text-primary font-bold text-xl">
                    合計8分/社（2社目以降）
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-3">
          <div className="text-center p-6 bg-slate-800 rounded-xl border border-slate-700">
            <div className="text-4xl font-bold text-primary mb-2">6つ</div>
            <p className="text-slate-300 text-sm">
              すべての機能が揃う
              <br />
              唯一のサービス
            </p>
          </div>
          <div className="text-center p-6 bg-slate-800 rounded-xl border border-slate-700">
            <div className="text-4xl font-bold text-primary mb-2">0回</div>
            <p className="text-slate-300 text-sm">
              ツール間の
              <br />
              コピペ作業
            </p>
          </div>
          <div className="text-center p-6 bg-slate-800 rounded-xl border border-slate-700">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <p className="text-slate-300 text-sm">
              ES・面接の
              <br />
              一貫性を担保
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
