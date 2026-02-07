import { Users, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SocialProofSection() {
  const stats = [
    {
      icon: Users,
      value: "1,000+",
      label: "名の就活生が利用",
    },
    {
      icon: FileText,
      value: "3,000+",
      label: "件のES生成実績",
    },
  ];

  const testimonials = [
    {
      text: "毎回ESゼロから書き直してたのがバカみたいです。経験を一回登録したら、企業ごとに勝手に調整してくれるので10社出すのも余裕でした。",
      author: "26卒 男性",
      school: "都内私立大学 経済学部",
    },
    {
      text: "面接で「ESに書いてあることと違うよね？」って言われるのが一番怖かったけど、整合性チェックのおかげでそれがなくなった。安心感が違います。",
      author: "26卒 女性",
      school: "関東国立大学 文学部",
    },
    {
      text: "最初ChatGPT使ってたけど、毎回経験コピペするのが面倒すぎて挫折。これは経験が保存されてるから、設問入れるだけでES出てくるのがいい。",
      author: "26卒 男性",
      school: "都内私立大学 工学部",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="max-w-3xl mx-auto grid gap-6 sm:grid-cols-2 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center border-slate-200 hover:border-primary/50 transition-colors">
                <CardContent className="pt-8 pb-8">
                  <div className="flex justify-center mb-4">
                    <Icon className="h-10 w-10 text-primary" />
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
