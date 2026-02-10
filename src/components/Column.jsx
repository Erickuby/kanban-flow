import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

function Column({ 
  column, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onEditColumn,
  onDeleteColumn,
  onMoveLeft,
  onMoveRight,
  canDelete 
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div className={`column ${isOver ? 'drag-over' : ''}`}>
      <div className="column-header">
        <div className="column-title">
          <span className="column-indicator" style={{ backgroundColor: column.color }} />
          <span>{column.title}</span>
        </div>
        <div className="column-actions">
          <span className="column-count">{tasks.length}</span>
          <div className="dropdown">
            <button
              className="column-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ⋮
            </button>
            {menuOpen && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setMenuOpen(false)
                    onEditColumn()
                  }}
                >
                  ✏️ Edit Column
                </button>
                {onMoveLeft && (
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setMenuOpen(false)
                      onMoveLeft()
                    }}
                  >
                    ⬅️ Move Left
                  </button>
                )}
                {onMoveRight && (
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setMenuOpen(false)
                      onMoveRight()
                    }}
                  >
                    ➡️ Move Right
                  </button>
                )}
                {canDelete && (
                  <button
                    className="dropdown-item danger"
                    onClick={() => {
                      setMenuOpen(false)
                      onDeleteColumn()
                    }}
                  >
                    🗑️ Delete Column
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="column-content" ref={setNodeRef}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="empty-column">
              <span className="empty-column-icon">📭</span>
              <span>No tasks yet</span>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))
          )}
        </SortableContext>
        <button className="add-task-btn" onClick={onAddTask}>
          + Add Task
        </button>
      </div>
    </div>
  )
}

export default Column
