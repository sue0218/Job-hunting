'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Pencil, Trash2, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface Experience {
  id: string
  title: string
  category?: string
  periodStart?: string
  periodEnd?: string
  situation?: string
  task?: string
  action?: string
  result?: string
  skills?: string[]
  rawNotes?: string
  createdAt: string
  updatedAt: string
}

interface ExperienceCardProps {
  experience: Experience
  onDelete: (id: string) => void
}

export function ExperienceCard({ experience, onDelete }: ExperienceCardProps) {
  const formatPeriod = () => {
    if (!experience.periodStart && !experience.periodEnd) return null
    const start = experience.periodStart ? new Date(experience.periodStart).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' }) : ''
    const end = experience.periodEnd ? new Date(experience.periodEnd).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' }) : '現在'
    return `${start} 〜 ${end}`
  }

  const getStarProgress = () => {
    let filled = 0
    if (experience.situation) filled++
    if (experience.task) filled++
    if (experience.action) filled++
    if (experience.result) filled++
    return filled
  }

  const starProgress = getStarProgress()

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            <Link href={`/experiences/${experience.id}`} className="hover:text-primary">
              {experience.title}
            </Link>
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {experience.category && (
              <Badge variant="secondary">{experience.category}</Badge>
            )}
            {formatPeriod() && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatPeriod()}
              </span>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/experiences/${experience.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                編集
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(experience.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {/* STAR Progress */}
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs text-muted-foreground">STAR記入状況</span>
            <span className="text-xs font-medium">{starProgress}/4</span>
          </div>
          <div className="flex gap-1">
            {['S', 'T', 'A', 'R'].map((letter, index) => {
              const isComplete = [
                experience.situation,
                experience.task,
                experience.action,
                experience.result,
              ][index]
              const colors = [
                'bg-blue-500',
                'bg-green-500',
                'bg-yellow-500',
                'bg-red-500',
              ]
              return (
                <div
                  key={letter}
                  className={`h-2 w-8 rounded-full ${isComplete ? colors[index] : 'bg-gray-200'}`}
                  title={['Situation', 'Task', 'Action', 'Result'][index]}
                />
              )
            })}
          </div>
        </div>

        {/* Preview */}
        {experience.situation && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {experience.situation}
          </p>
        )}

        {/* Skills */}
        {experience.skills && experience.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {experience.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {experience.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{experience.skills.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
