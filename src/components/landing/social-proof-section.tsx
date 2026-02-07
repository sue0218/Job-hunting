import { Users, FileText, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SocialProofSection() {
  const stats = [
    {
      icon: Users,
      value: "3,200+",
      label: "名の就活生が利用",
    },
    {
      icon: FileText,
      value: "15,000+",
      label: "件のES生成実績",
    },
    {
      icon: Star,
      value: "4.8 / 5.0",
      label: "平均ユーザー評価",
      starFilled: true,
    },
  ];

  const testimonials = [
    {
      text: "ESの作成時間が1/10に。経験DBのおかげで何社でも一貫性のある内容を出せました。",
      author: "T.K.",
      school: "早稲田大学 商学部",
    },
    {
      text: "面接で「ESと違うね」と言われることがなくなりました。整合性チェックが神機能。",
      author: "M.S.",
      school: "慶應義塾大学 法学部",
    },
    {
      text: "ChatGPTでES作ってたけど、経験の管理が面倒すぎた。これは全部つながってるから楽。",
      author: "A.Y.",
      school: "東京大学 工学部",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-3 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center border-slate-200 hover:border-primary/50 transition-colors">
                <CardContent className="pt-8 pb-8">
                  <div className="flex justify-center mb-4">
                    <Icon
                      className={`h-10 w-10 ${
                        stat.starFilled ? "text-amber-500 fill-amber-500" : "text-primary"
                      }`}
                    />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    {stat.value}
                  </div>
                  <p className="text-slate-600">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10 text-center">
            ユーザーの声
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 pb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-amber-500 fill-amber-500"
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 leading-relaxed">
                    {testimonial.text}
                  </p>
                  <div className="border-t border-slate-100 pt-4">
                    <p className="font-medium text-slate-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-slate-600">{testimonial.school}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
