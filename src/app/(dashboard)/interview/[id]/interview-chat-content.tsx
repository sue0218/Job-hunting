'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Send, Loader2, CheckCircle, Star, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { addInterviewTurn, updateInterviewSession } from '@/lib/actions/interview-sessions'
import { generateFollowUpQuestion, generateInterviewFeedback, type InterviewerType } from '@/lib/llm/interview-service'
import type { InterviewSessionWithTurns } from '@/lib/actions/interview-sessions'
import type { Experience, InterviewTurn } from '@/lib/db/schema'

interface InterviewChatContentProps {
  session: InterviewSessionWithTurns
  experience: Experience | null
}

interface ChatMessage {
  id: string
  role: 'interviewer' | 'user'
  content: string
  timestamp: Date
}

// Convert DB turns to chat messages for display
function turnsToMessages(turns: InterviewTurn[]): ChatMessage[] {
  const messages: ChatMessage[] = []

  for (const turn of turns) {
    if (turn.interviewerMessage) {
      messages.push({
        id: `${turn.id}-interviewer`,
        role: 'interviewer',
        content: turn.interviewerMessage,
        timestamp: turn.createdAt,
      })
    }
    if (turn.userResponse) {
      messages.push({
        id: `${turn.id}-user`,
        role: 'user',
        content: turn.userResponse,
        timestamp: turn.createdAt,
      })
    }
  }

  return messages
}

export function InterviewChatContent({ session: initialSession, experience }: InterviewChatContentProps) {
  const [session, setSession] = useState(initialSession)
  const [messages, setMessages] = useState<ChatMessage[]>(() => turnsToMessages(initialSession.turns))
  const [isSending, setIsSending] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [userInput, setUserInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!userInput.trim()) return

    setIsSending(true)

    try {
      const userContent = userInput.trim()

      // Add user message to display immediately
      const tempUserMessage: ChatMessage = {
        id: `temp-user-${Date.now()}`,
        role: 'user',
        content: userContent,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, tempUserMessage])
      setUserInput('')

      // Generate AI follow-up question using LLM
      const sessionType = session.type as 'general' | 'experience' | 'company'
      const interviewerType = (session.interviewerType || 'standard') as InterviewerType
      const followUpQuestion = await generateFollowUpQuestion({
        sessionType,
        interviewerType,
        experience,
        companyName: session.companyName,
        previousTurns: session.turns.map(t => ({
          interviewerMessage: t.interviewerMessage,
          userResponse: t.userResponse,
        })),
        userResponse: userContent,
      })

      // Create new turn with user response and next interviewer question
      const newTurn = await addInterviewTurn(session.id, {
        turnNumber: session.turns.length + 1,
        userResponse: userContent,
        interviewerMessage: followUpQuestion,
      })

      if (!newTurn) {
        throw new Error('Failed to add turn')
      }

      // Add AI message to display
      const aiMessage: ChatMessage = {
        id: `${newTurn.id}-interviewer`,
        role: 'interviewer',
        content: followUpQuestion,
        timestamp: new Date(),
      }

      // Update messages (replace temp user message with proper one)
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempUserMessage.id)
        return [
          ...filtered,
          {
            id: `${newTurn.id}-user`,
            role: 'user',
            content: userContent,
            timestamp: newTurn.createdAt,
          },
          aiMessage,
        ]
      })

      // Update local session state
      setSession(prev => ({
        ...prev,
        turns: [...prev.turns, newTurn],
      }))
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('メッセージの送信に失敗しました')
      // Revert optimistic update
      setMessages(turnsToMessages(session.turns))
    } finally {
      setIsSending(false)
    }
  }

  const handleEndSession = async () => {
    setIsEnding(true)

    try {
      const sessionType = session.type as 'general' | 'experience' | 'company'
      const interviewerType = (session.interviewerType || 'standard') as InterviewerType

      // Generate feedback using LLM
      const { feedback, rating } = await generateInterviewFeedback({
        sessionType,
        interviewerType,
        experience,
        companyName: session.companyName,
        turns: session.turns.map(t => ({
          interviewerMessage: t.interviewerMessage,
          userResponse: t.userResponse,
        })),
      })

      const updated = await updateInterviewSession(session.id, {
        status: 'completed',
        feedback,
        rating,
      })

      if (updated) {
        setSession(prev => ({
          ...prev,
          status: 'completed',
          feedback,
          rating,
        }))
      }
    } catch (error) {
      console.error('Failed to end session:', error)
      alert('セッションの終了に失敗しました')
    } finally {
      setIsEnding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getSessionTitle = () => {
    if (session.companyName) return session.companyName
    if (experience) return experience.title
    switch (session.type) {
      case 'general': return '一般質問'
      case 'experience': return '経験深掘り'
      case 'company': return '企業別対策'
      default: return '面接練習'
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/interview" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{getSessionTitle()}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                {session.status === 'completed' ? '完了' : '進行中'}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {session.turns.length}ターン
              </span>
            </div>
          </div>
        </div>
        {session.status !== 'completed' && (
          <Button
            variant="outline"
            onClick={handleEndSession}
            disabled={isEnding || session.turns.length < 1}
          >
            {isEnding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                フィードバック生成中...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                セッション終了
              </>
            )}
          </Button>
        )}
      </div>

      {/* Feedback (if completed) */}
      {session.status === 'completed' && session.feedback && (
        <Card className="mb-4 border-green-200 bg-green-50 shrink-0">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              評価: {session.rating}/5
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
              {session.feedback}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                面接官が考えています...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {session.status !== 'completed' && (
        <div className="flex gap-2 shrink-0">
          <Textarea
            placeholder="回答を入力...（Shift+Enterで改行）"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            className="resize-none"
            disabled={isSending}
          />
          <Button
            onClick={handleSend}
            disabled={!userInput.trim() || isSending}
            className="px-4"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Back button for completed sessions */}
      {session.status === 'completed' && (
        <div className="flex justify-center shrink-0">
          <Link href="/interview">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              面接練習一覧に戻る
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
