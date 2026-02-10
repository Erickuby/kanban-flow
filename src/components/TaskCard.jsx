import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns'

function TaskCard({ task, onEdit, onDelete, isDragging }) {
  const [menuOpen, setMenuOpen] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getDueDateInfo = () => {
    if (!task.dueDate) return null
    
    const date = parseISO(task.dueDate)
    let className = ''
    let label = format(date, 'MMM d')
    
    if (isPast(date) && !isToday(date)) {
      className = 'overdue'
      label = `Overdue: ${label}`
    } else if (isToday(date)) {
      className = 'soon'
      label = 'Today'
    } else if (isTomorrow(date)) {
      className = 'soon'
      label = 'Tomorrow'
    }
    
    return { className, label }
  }

  const dueInfo = getDueDateInfo()

  // Calculate subtask progress
  const subtasks = task.subtasks || []
  const completedSubtasks = subtasks.filter(s => s.completed).length
  const subtaskProgress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="task-card-header">
        <span className="task-title">{task.title}</span>
        <div className="dropdown">
          <button
            className="task-menu-btn"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(!menuOpen)
            }}
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpen(false)
                  onEdit()
                }}
              >
                ✏️ Edit
              </button>
              <button
                className="dropdown-item danger"
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpen(false)
                  onDelete()
                }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {subtasks.length > 0 && (
        <div className="subtasks-preview">
          <span>✓</span>
          <div className="subtasks-progress">
            <div 
              className="subtasks-progress-bar" 
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
          <span className="subtasks-count">{completedSubtasks}/{subtasks.length}</span>
        </div>
      )}
      
      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag, index) => (
            <span key={index} className={`tag ${tag.color}`}>
              {tag.text}
            </span>
          ))}
        </div>
      )}
      
      <div className="task-footer">
        <div className="task-meta">
          {dueInfo && (
            <span className={`task-due ${dueInfo.className}`}>
              📅 {dueInfo.label}
            </span>
          )}
        </div>
        {task.priority && (
          <span className={`priority-badge ${task.priority}`}>
            {task.priority}
          </span>
        )}
      </div>
    </div>
  )
}

export default TaskCard
