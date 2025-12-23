/**
 * Upcoming Tasks Card - Shows upcoming tasks or empty state
 */
import * as React from 'react'
import { Clock, CheckCircle2, Plus } from 'lucide-react'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from '../../../components/ui/app-card'
import { Button } from '../../../components/ui/button'
import { cn } from '../../../lib/utils'

export interface UpcomingTask {
  id: string
  title: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  assignee: string
}

export interface UpcomingTasksCardProps {
  tasks?: UpcomingTask[]
  onAddTask?: () => void
}

export function UpcomingTasksCard({ tasks = [], onAddTask }: UpcomingTasksCardProps) {
  if (tasks.length === 0) {
    return (
      <AppCard variant="default" shadow="md" className="h-full">
        <AppCardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" />
            <AppCardTitle className="text-sm">Upcoming Tasks</AppCardTitle>
          </div>
        </AppCardHeader>
        <AppCardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="p-3 rounded-full bg-harbor-50 dark:bg-success/20 mb-3">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <p className="text-sm font-medium text-success mb-1">All caught up!</p>
            <p className="text-xs text-muted mb-3">No pending tasks due</p>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onAddTask}>
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </Button>
          </div>
        </AppCardContent>
      </AppCard>
    )
  }

  return (
    <AppCard variant="default" shadow="md" className="h-full">
      <AppCardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" />
            <AppCardTitle className="text-sm">Upcoming Tasks</AppCardTitle>
          </div>
          <span className="text-xs text-muted">{tasks.length} due</span>
        </div>
      </AppCardHeader>
      <AppCardContent className="pt-0">
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-2">
              <span
                className={cn(
                  'flex-shrink-0 mt-1 w-2 h-2 rounded-full',
                  task.priority === 'high' ? 'bg-error' : task.priority === 'medium' ? 'bg-warning' : 'bg-muted'
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-primary truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn(
                    'text-xs',
                    task.dueDate === 'Today' ? 'text-error font-medium' : 'text-muted'
                  )}>
                    {task.dueDate}
                  </span>
                  <span className="text-xs text-muted">• {task.assignee}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-3 gap-1.5" onClick={onAddTask}>
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </Button>
      </AppCardContent>
    </AppCard>
  )
}
