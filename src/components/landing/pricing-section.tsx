import Link from "next/link";
import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PricingSection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            料金プラン
          </h2>
          <p className="text-lg text-slate-600">
            まずは無料で試して、本選考シーズンにアップグレード
          </p>
        </div>

        {/* 50% OFF Banner */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 text-center shadow-lg">
            <div className="flex items-center justify-center gap-2 text-white">
              <Sparkles className="h-5 w-5" />
              <p className="text-lg font-bold">
                ローンチ記念価格で提供中
              </p>
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-2 mb-16">
          {/* Free Card */}
          <Card className="relative flex flex-col">
            <CardHeader>
              <div className="mb-2">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  無料
                </Badge>
              </div>
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold text-slate-900">¥0</span>
                <span className="text-slate-600 ml-2">/月</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">経験DB 3件まで</p>
                    <p className="text-sm text-slate-600">ガクチカ・自己PR等を登録</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">ES生成 2回/月</p>
                    <p className="text-sm text-slate-600">約2社分のES作成が可能</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">面接練習 1回/月</p>
                    <p className="text-sm text-slate-600">月1回の模擬面接</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">整合性チェック</p>
                    <p className="text-sm text-slate-600">ES・面接の矛盾検出</p>
                  </div>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-900 mb-1">
                  こんな人におすすめ
                </p>
                <p className="text-sm text-slate-600">
                  就活初期で、まずサービスを試したい方
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" size="lg" asChild>
                <Link href="/sign-up">無料で始める</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Standard Card */}
          <Card className="relative flex flex-col border-primary border-2 shadow-xl">
            {/* Recommended Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1 text-sm">
                おすすめ
              </Badge>
            </div>

            <CardHeader>
              <div className="mb-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                  ローンチ記念価格
                </Badge>
              </div>
              <CardTitle className="text-2xl">Standard</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold text-primary">¥980</span>
                <span className="text-slate-600 ml-2">/月</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">経験DB 無制限</p>
                    <p className="text-sm text-slate-600">すべての経験を登録可能</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">ES生成 30回/月</p>
                    <p className="text-sm text-slate-600">約30社分のES作成</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">面接練習 60回/月</p>
                    <p className="text-sm text-slate-600">1日2回練習可能</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">整合性チェック</p>
                    <p className="text-sm text-slate-600">無制限</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">4種類の面接官タイプ</p>
                    <p className="text-sm text-slate-600">圧迫・優しい・論理的・フレンドリー</p>
                  </div>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-slate-900 mb-1">
                  こんな人におすすめ
                </p>
                <p className="text-sm text-slate-600">
                  本選考で10社以上受ける予定の方
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-primary to-blue-600 shadow-lg hover:shadow-xl transition-shadow" size="lg" asChild>
                <Link href="/sign-up">今すぐ始める</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Comparison Mini-Table */}
        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
            プラン比較
          </h3>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 border-b border-slate-200">
              <div className="font-medium text-slate-900">項目</div>
              <div className="font-medium text-slate-900 text-center">Free</div>
              <div className="font-medium text-primary text-center">Standard</div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-slate-100">
              <div className="text-slate-700">月の応募企業数</div>
              <div className="text-center text-slate-600">2社まで</div>
              <div className="text-center text-primary font-medium">30社まで</div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-slate-100">
              <div className="text-slate-700">面接練習の頻度</div>
              <div className="text-center text-slate-600">月1回</div>
              <div className="text-center text-primary font-medium">毎日2回</div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4">
              <div className="text-slate-700">経験DBの登録数</div>
              <div className="text-center text-slate-600">3件</div>
              <div className="text-center text-primary font-medium">無制限</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            よくある質問
          </h3>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="font-medium text-slate-900 mb-2">
                無料プランから有料プランへの切り替えは簡単ですか？
              </h4>
              <p className="text-slate-600">
                はい、ダッシュボードから1クリックでアップグレードできます。
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="font-medium text-slate-900 mb-2">
                料金プランについて教えてください
              </h4>
              <p className="text-slate-600">
                現在ローンチ記念価格として月額¥980で提供しています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
