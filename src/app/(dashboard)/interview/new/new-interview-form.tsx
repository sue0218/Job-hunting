'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, Play, Loader2, MessageSquare, BookOpen, Building2, Smile, Frown, Brain, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import type { Experience } from '@/lib/db/schema'
import { createInterviewSession, addInterviewTurn } from '@/lib/actions/interview-sessions'

interface NewInterviewFormProps {
  experiences: Experience[]
}

type SessionType = 'general' | 'experience' | 'company'
type InterviewerType = 'standard' | 'friendly' | 'strict' | 'logical'

const SESSION_TYPES = [
  {
    value: 'general',
    label: '一般質問',
    description: '自己PR、ガクチカ、志望動機などの定番質問',
    icon: MessageSquare,
  },
  {
    value: 'experience',
    label: '経験深掘り',
    description: '登録した経験について深掘りされる練習',
    icon: BookOpen,
  },
  {
    value: 'company',
    label: '企業別対策',
    description: '特定の企業を想定した面接練習',
    icon: Building2,
  },
]

const INTERVIEWER_TYPES = [
  {
    value: 'standard',
    label: '標準',
    description: 'バランスの取れた一般的な面接官',
    icon: User,
  },
  {
    value: 'friendly',
    label: '優しい',
    description: '緊張をほぐしてくれる温かい雰囲気の面接官',
    icon: Smile,
  },
  {
    value: 'strict',
    label: '厳しい',
    description: '圧迫面接気味。深い質問で本質を見抜く',
    icon: Frown,
  },
  {
    value: 'logical',
    label: '論理的',
    description: '論理的一貫性を重視。矛盾を見逃さない',
    icon: Brain,
  },
]

const GENERAL_QUESTIONS = [
  '自己PRをお願いします。',
  '学生時代に力を入れたことを教えてください。',
  'あなたの強みと弱みを教えてください。',
  '挫折経験とそれをどう乗り越えたか教えてください。',
  '5年後のキャリアプランを教えてください。',
]

export function NewInterviewForm({ experiences }: NewInterviewFormProps) {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const [sessionType, setSessionType] = useState<SessionType>('general')
  const [interviewerType, setInterviewerType] = useState<InterviewerType>('standard')
  const [selectedExperience, setSelectedExperience] = useState<string>('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState<{ message: string; isQuotaError: boolean } | null>(null)

  const handleStart = async () => {
    if (sessionType === 'experience' && !selectedExperience) {
      setError({ message: '経験を選択してください', isQuotaError: false })
      return
    }
    if (sessionType === 'company' && !companyName) {
      setError({ message: '企業名を入力してください', isQuotaError: false })
      return
    }

    setIsStarting(true)
    setError(null)

    try {
      // Generate initial question based on session type
      let initialQuestion = ''
      let title = ''

      if (sessionType === 'general') {
        initialQuestion = GENERAL_QUESTIONS[Math.floor(Math.random() * GENERAL_QUESTIONS.length)]
        title = '一般面接練習'
      } else if (sessionType === 'experience') {
        const exp = experiences.find(e => e.id === selectedExperience)
        initialQuestion = `${exp?.title}についてお聞きします。この経験を始めたきっかけは何ですか？`
        title = `経験深掘り: ${exp?.title}`
      } else {
        initialQuestion = `${companyName}への志望動機を教えてください。`
        title = `企業別面接: ${companyName}`
      }

      // Create session in database
      const session = await createInterviewSession({
        title,
        type: sessionType,
        interviewerType,
        companyName: sessionType === 'company' ? companyName : undefined,
        experienceId: sessionType === 'experience' ? selectedExperience : undefined,
      })

      // Add initial interviewer question as first turn
      await addInterviewTurn(session.id, {
        turnNumber: 1,
        interviewerMessage: initialQuestion,
        userResponse: null,
      })

      router.push(`/interview/${session.id}`)
    } catch (err) {
      console.error('Failed to create interview session:', err)
      const errorMessage = err instanceof Error ? err.message : 'セッションの作成に失敗しました'
      const isQuotaError = errorMessage.includes('上限')
      setError({ message: errorMessage, isQuotaError })
      setIsStarting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/interview" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-1 h-4 w-4" />
          面接練習に戻る
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">面接練習を開始</h1>
        <p className="text-gray-500">練習タイプを選んでセッションを開始しましょう</p>
      </div>

      {error && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 max-w-2xl ${error.isQuotaError ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
          <AlertCircle className={`h-5 w-5 mt-0.5 ${error.isQuotaError ? 'text-amber-600' : 'text-red-600'}`} />
          <div className="flex-1">
            <p className={`font-medium ${error.isQuotaError ? 'text-amber-800' : 'text-red-800'}`}>
              {error.message}
            </p>
            {error.isQuotaError && (
              <p className="mt-1 text-sm text-amber-700">
                Standardプランにアップグレードすると、より多くの面接練習ができます。
                <Link href="/billing" className="ml-1 underline font-medium">
                  プランを確認する
                </Link>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
        {/* Session Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>練習タイプ</CardTitle>
            <CardDescription>どのような面接練習をしますか？</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={sessionType}
              onValueChange={(value) => setSessionType(value as SessionType)}
              className="space-y-3"
            >
              {SESSION_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    sessionType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <RadioGroupItem value={type.value} className="mt-1" />
                  <type.icon className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Interviewer Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>面接官タイプ</CardTitle>
            <CardDescription>どんな面接官と練習しますか？</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {INTERVIEWER_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    interviewerType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="interviewerType"
                    value={type.value}
                    checked={interviewerType === type.value}
                    onChange={(e) => setInterviewerType(e.target.value as InterviewerType)}
                    className="mt-1"
                  />
                  <type.icon className={`h-5 w-5 mt-0.5 ${
                    type.value === 'friendly' ? 'text-green-500' :
                    type.value === 'strict' ? 'text-red-500' :
                    type.value === 'logical' ? 'text-blue-500' :
                    'text-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience Selection (for experience type) */}
        {sessionType === 'experience' && (
          <Card>
            <CardHeader>
              <CardTitle>深掘りする経験</CardTitle>
              <CardDescription>面接で深掘りされたい経験を選択してください</CardDescription>
            </CardHeader>
            <CardContent>
              {experiences.length > 0 ? (
                <div className="space-y-2">
                  {experiences.map((exp) => (
                    <label
                      key={exp.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedExperience === exp.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={exp.id}
                        checked={selectedExperience === exp.id}
                        onChange={(e) => setSelectedExperience(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{exp.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {exp.category && (
                            <Badge variant="secondary" className="text-xs">
                              {exp.category}
                            </Badge>
                          )}
                          {exp.skills?.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">経験が登録されていません</p>
                  <Link href="/experiences/new">
                    <Button variant="outline" size="sm">経験を登録する</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Company Name (for company type) */}
        {sessionType === 'company' && (
          <Card>
            <CardHeader>
              <CardTitle>企業名</CardTitle>
              <CardDescription>面接を想定する企業名を入力してください</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="companyName">企業名</Label>
                <Input
                  id="companyName"
                  placeholder="例: 株式会社○○"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Button */}
        <div className="flex justify-end gap-4">
          <Link href="/interview">
            <Button variant="outline">キャンセル</Button>
          </Link>
          <Button onClick={handleStart} disabled={isStarting}>
            {isStarting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                開始中...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                セッションを開始
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
