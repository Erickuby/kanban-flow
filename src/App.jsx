import { useState, useEffect, useCallback } from 'react'
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { v4 as uuidv4 } from 'uuid'
import Column from './components/Column'
import TaskCard from './components/TaskCard'
import TaskModal from './components/TaskModal'
import ColumnModal from './components/ColumnModal'
import Toast from './components/Toast'
import { isToday, isTomorrow, isPast, parseISO, differenceInHours } from 'date-fns'
import './index.css'

const STORAGE_KEY = 'kanban-board-data-v2'
const THEME_KEY = 'kanban-theme'

const COLUMN_COLORS = [
  '#6b7280', '#3b82f6', '#f59e0b', '#a855f7', '#22c55e',
  '#ef4444', '#ec4899', '#06b6d4', '#f97316', '#8b5cf6'
]

const defaultColumns = [
  { id: 'backlog', title: 'Backlog', color: '#6b7280' },
  { id: 'todo', title: 'To Do', color: '#3b82f6' },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'review', title: 'Review', color: '#a855f7' },
  { id: 'done', title: 'Done', color: '#22c55e' },
]

const defaultTasks = [
  {
    id: uuidv4(),
    title: 'B-TNE Seminar Prep',
    description: 'Prepare slides and talking points for AI career scaling talk',
    columnId: 'done',
    priority: 'high',
    dueDate: '2026-02-08',
    tags: [{ text: 'B-TNE', color: 'purple' }],
    subtasks: [
      { id: uuidv4(), text: 'Create slide deck', completed: true },
      { id: uuidv4(), text: 'Prepare demo', completed: true },
      { id: uuidv4(), text: 'Practice run-through', completed: true },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'YouTube Channel Setup & Rebrand',
    description: 'Rebrand to "Eric Explains AI" with dark mode aesthetic, consistent thumbnails, and channel optimization',
    columnId: 'done',
    priority: 'high',
    dueDate: '2026-02-16',
    tags: [{ text: 'YouTube', color: 'red' }, { text: 'Brand', color: 'purple' }],
    subtasks: [
      { id: uuidv4(), text: 'Update channel name, banner, and description', completed: true },
      { id: uuidv4(), text: 'Create thumbnail template system', completed: true },
      { id: uuidv4(), text: 'Set up video playlist structure', completed: true },
      { id: uuidv4(), text: 'Design intro/outro cards', completed: true },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Video 1: Build a Client Portal in 45 Minutes with Lovable',
    description: 'Freelancers/agencies need client dashboards. Build: Login, project status, file uploads, messaging.',
    columnId: 'todo',
    priority: 'high',
    dueDate: '2026-02-16',
    tags: [{ text: 'YouTube', color: 'red' }, { text: 'Vibe Coding', color: 'orange' }],
    subtasks: [
      { id: uuidv4(), text: 'Write script (patient teacher style)', completed: false },
      { id: uuidv4(), text: 'Build app in Lovable', completed: false },
      { id: uuidv4(), text: 'Record walkthrough (25-30 min)', completed: false },
      { id: uuidv4(), text: 'Create thumbnail (before/after split)', completed: false },
      { id: uuidv4(), text: 'Publish + LinkedIn repurpose', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Video 2: Automate Lead Enrichment with n8n + Hunter.io + GPT-4',
    description: 'Sales teams spending hours researching leads. Build: Form → scrape → enrich with AI → push to CRM.',
    columnId: 'backlog',
    priority: 'medium',
    dueDate: '2026-02-23',
    tags: [{ text: 'YouTube', color: 'red' }, { text: 'n8n', color: 'green' }],
    subtasks: [
      { id: uuidv4(), text: 'Design workflow architecture', completed: false },
      { id: uuidv4(), text: 'Build and test n8n workflow', completed: false },
      { id: uuidv4(), text: 'Record walkthrough', completed: false },
      { id: uuidv4(), text: 'Create thumbnail', completed: false },
      { id: uuidv4(), text: 'Publish + LinkedIn repurpose', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Video 3: Build a SaaS MVP in One Afternoon with Bolt.new',
    description: 'Solopreneur wants to validate an idea fast. Build: Landing page + waitlist + basic dashboard.',
    columnId: 'backlog',
    priority: 'medium',
    dueDate: '2026-03-02',
    tags: [{ text: 'YouTube', color: 'red' }, { text: 'Vibe Coding', color: 'orange' }],
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Video 4: Create an AI Agent That Books Meetings (n8n + Calendly)',
    description: 'Coaches/consultants drowning in scheduling. Build: AI reads emails → suggests times → books via Calendly.',
    columnId: 'backlog',
    priority: 'medium',
    dueDate: '2026-03-09',
    tags: [{ text: 'YouTube', color: 'red' }, { text: 'n8n', color: 'green' }],
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Video 5: Build an Internal Tool in 30 Minutes with Replit Agent',
    description: 'Dev teams need quick internal dashboards. Build: Data viewer, search, export — from a prompt.',
    columnId: 'backlog',
    priority: 'low',
    dueDate: '2026-03-16',
    tags: [{ text: 'YouTube', color: 'red' }, { text: 'Vibe Coding', color: 'orange' }],
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Video 6: Automate Your Weekly Report with n8n + Notion + GPT-4',
    description: 'PMs spending Friday afternoons writing status updates. Build: Pull tasks → AI summarizes → sends email.',
    columnId: 'backlog',
    priority: 'medium',
    dueDate: '2026-03-23',
    tags: [{ text: 'YouTube', color: 'red' }, { text: 'n8n', color: 'green' }],
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Video 7: Build a Customer Feedback Dashboard with Lovable',
    description: 'Startups need to track NPS/feedback without expensive tools. Build: Feedback form + sentiment + dashboard.',
    columnId: 'backlog',
    priority: 'low',
    dueDate: '2026-03-30',
    tags: [{ text: 'YouTube', color: 'red' }, { text: 'Vibe Coding', color: 'orange' }],
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Video 8: Connect Claude to Your Tools with MCP (Practical Guide)',
    description: 'Devs want Claude to actually use their APIs. Build: Claude connected to database + Slack + custom API.',
    columnId: 'backlog',
    priority: 'medium',
    dueDate: '2026-04-06',
    tags: [{ text: 'YouTube', color: 'red' }, { text: 'MCP', color: 'cyan' }],
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Video 9: Build a Quote Generator for Freelancers with Bolt.new',
    description: 'Freelancers manually creating proposals. Build: Form input → auto-generate PDF quote → email to client.',
    columnId: 'backlog',
    priority: 'low',
    dueDate: '2026-04-13',
    tags: [{ text: 'YouTube', color: 'red' }, { text: 'Vibe Coding', color: 'orange' }],
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Video 10: Create a Personal CRM with n8n + Airtable + AI',
    description: 'Solopreneurs tracking relationships manually. Build: Auto-log meetings, emails → AI suggests follow-ups.',
    columnId: 'backlog',
    priority: 'medium',
    dueDate: '2026-04-20',
    tags: [{ text: 'YouTube', color: 'red' }, { text: 'n8n', color: 'green' }],
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Community Growth Strategy',
    description: 'Plan outreach to grow B-TNE from 20 to 50 members',
    columnId: 'backlog',
    priority: 'medium',
    dueDate: '2026-02-28',
    tags: [{ text: 'B-TNE', color: 'purple' }, { text: 'Strategy', color: 'blue' }],
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Platform Build',
    description: 'Build The Black Tech Community platform',
    columnId: 'in-progress',
    priority: 'high',
    dueDate: '2026-03-15',
    tags: [{ text: 'Dev', color: 'cyan' }],
    subtasks: [
      { id: uuidv4(), text: 'Design mockups', completed: true },
      { id: uuidv4(), text: 'Set up database', completed: true },
      { id: uuidv4(), text: 'Build authentication', completed: false },
      { id: uuidv4(), text: 'Create dashboard', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'n8n Workflow Templates',
    description: 'Package and document automation workflows for sale',
    columnId: 'backlog',
    priority: 'low',
    dueDate: '2026-03-01',
    tags: [{ text: 'Automation', color: 'green' }],
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Google Sites Project',
    description: 'Complete Google Sites setup (still needed?)',
    columnId: 'backlog',
    priority: 'low',
    dueDate: null,
    tags: [{ text: 'Web', color: 'pink' }],
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
]

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark'
  })
  
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        return data.columns || defaultColumns
      } catch {
        return defaultColumns
      }
    }
    return defaultColumns
  })
  
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        return data.tasks || defaultTasks
      } catch {
        return defaultTasks
      }
    }
    return defaultTasks
  })
  
  const [activeTask, setActiveTask] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [columnModalOpen, setColumnModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [editingColumn, setEditingColumn] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [toasts, setToasts] = useState([])
  const [isWorking, setIsWorking] = useState(false)

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ columns, tasks }))
  }, [columns, tasks])

  // Check for due date reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      tasks.forEach(task => {
        if (!task.dueDate || task.columnId === 'done') return
        
        const dueDate = parseISO(task.dueDate)
        const hoursUntilDue = differenceInHours(dueDate, now)
        
        if (hoursUntilDue > 0 && hoursUntilDue <= 24) {
          // Due within 24 hours
          const existingToast = toasts.find(t => t.taskId === task.id && t.type === 'reminder')
          if (!existingToast) {
            addToast({
              type: 'warning',
              title: 'Due Soon!',
              message: `"${task.title}" is due ${isToday(dueDate) ? 'today' : 'tomorrow'}`,
              taskId: task.id,
            })
          }
        }
      })
    }

    checkReminders()
    const interval = setInterval(checkReminders, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [tasks])

  const addToast = useCallback((toast) => {
    const id = uuidv4()
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const handleDragStart = (event) => {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task)
    setIsWorking(true)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveTask(null)
    setIsWorking(false)

    if (!over) return

    const activeTask = tasks.find(t => t.id === active.id)
    if (!activeTask) return

    let newColumnId = over.id

    const overTask = tasks.find(t => t.id === over.id)
    if (overTask) {
      newColumnId = overTask.columnId
    }

    const isValidColumn = columns.some(c => c.id === newColumnId)
    if (!isValidColumn) return

    if (activeTask.columnId !== newColumnId) {
      setTasks(tasks.map(t =>
        t.id === active.id ? { ...t, columnId: newColumnId } : t
      ))
    }
  }

  const handleAddTask = (columnId) => {
    setSelectedColumn(columnId)
    setEditingTask(null)
    setModalOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setSelectedColumn(task.columnId)
    setModalOpen(true)
  }

  const handleSaveTask = (taskData) => {
    setIsWorking(true)
    setTimeout(() => setIsWorking(false), 500)
    
    if (editingTask) {
      setTasks(tasks.map(t =>
        t.id === editingTask.id ? { ...t, ...taskData } : t
      ))
      addToast({ type: 'success', title: 'Task Updated', message: `"${taskData.title}" has been updated` })
    } else {
      const newTask = {
        id: uuidv4(),
        ...taskData,
        columnId: selectedColumn,
        createdAt: new Date().toISOString(),
      }
      setTasks([...tasks, newTask])
      addToast({ type: 'success', title: 'Task Created', message: `"${taskData.title}" has been added` })
    }
    setModalOpen(false)
    setEditingTask(null)
    setSelectedColumn(null)
  }

  const handleDeleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    setTasks(tasks.filter(t => t.id !== taskId))
    addToast({ type: 'success', title: 'Task Deleted', message: `"${task?.title}" has been removed` })
  }

  // Column Management
  const handleAddColumn = () => {
    setEditingColumn(null)
    setColumnModalOpen(true)
  }

  const handleEditColumn = (column) => {
    setEditingColumn(column)
    setColumnModalOpen(true)
  }

  const handleSaveColumn = (columnData) => {
    if (editingColumn) {
      setColumns(columns.map(c =>
        c.id === editingColumn.id ? { ...c, ...columnData } : c
      ))
    } else {
      const newColumn = {
        id: uuidv4(),
        ...columnData,
      }
      setColumns([...columns, newColumn])
    }
    setColumnModalOpen(false)
    setEditingColumn(null)
  }

  const handleDeleteColumn = (columnId) => {
    // Move tasks to backlog or first column
    const fallbackColumn = columns.find(c => c.id !== columnId)?.id || 'backlog'
    setTasks(tasks.map(t =>
      t.columnId === columnId ? { ...t, columnId: fallbackColumn } : t
    ))
    setColumns(columns.filter(c => c.id !== columnId))
    addToast({ type: 'success', title: 'Column Deleted', message: 'Tasks moved to first column' })
  }

  const handleMoveColumn = (columnId, direction) => {
    const index = columns.findIndex(c => c.id === columnId)
    const newIndex = direction === 'left' ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= columns.length) return
    
    const newColumns = [...columns]
    const [removed] = newColumns.splice(index, 1)
    newColumns.splice(newIndex, 0, removed)
    setColumns(newColumns)
  }

  // Export/Import
  const handleExport = () => {
    const data = JSON.stringify({ columns, tasks }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kanban-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    addToast({ type: 'success', title: 'Exported!', message: 'Your board has been downloaded' })
  }

  const handleSyncToGitHub = () => {
    const data = JSON.stringify({ columns, tasks }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'board-data.json'
    a.click()
    URL.revokeObjectURL(url)

    addToast({
      type: 'info',
      title: 'Sync Instructions',
      message: 'File downloaded. Run: node sync-to-github.js "Update board"'
    })

    console.log('To sync to GitHub:')
    console.log('1. Place board-data.json in the project root')
    console.log('2. Run: node sync-to-github.js "Your commit message"')
  }

  const handleImport = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result)
        if (data.columns) setColumns(data.columns)
        if (data.tasks) setTasks(data.tasks)
        addToast({ type: 'success', title: 'Imported!', message: 'Your board has been restored' })
      } catch {
        addToast({ type: 'error', title: 'Import Failed', message: 'Invalid file format' })
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  // Get all unique tags for filter
  const allTags = [...new Set(tasks.flatMap(t => t.tags?.map(tag => tag.text) || []))]

  const filteredTasks = tasks.filter(task => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.text.toLowerCase().includes(query))
      if (!matchesSearch) return false
    }
    
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false
    }
    
    if (tagFilter !== 'all' && !task.tags?.some(tag => tag.text === tagFilter)) {
      return false
    }
    
    return true
  })

  const getColumnTasks = (columnId) => {
    return filteredTasks.filter(task => task.columnId === columnId)
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.columnId === 'done').length,
    inProgress: tasks.filter(t => t.columnId === 'in-progress').length,
    highPriority: tasks.filter(t => t.priority === 'high' && t.columnId !== 'done').length,
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className={`status-indicator ${isWorking ? 'working' : ''}`}>
            <span>{isWorking ? '💪 Working' : '💤 Idle'}</span>
          </div>
          <div className="logo">
            <span className="logo-icon">📋</span>
            <span>Kanban Flow</span>
          </div>
        </div>
        <div className="header-right">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="btn btn-primary" onClick={() => handleAddTask('todo')}>
            <span>+</span>
            <span>New Task</span>
          </button>
        </div>
      </header>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.inProgress}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Done</span>
            </div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: stats.highPriority > 0 ? '#ef4444' : 'inherit' }}>
                {stats.highPriority}
              </span>
              <span className="stat-label">High Priority</span>
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Priority:</span>
            <select
              className="filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Tag:</span>
            <select
              className="filter-select"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="all">All</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="toolbar-right">
          <div className="data-buttons">
            <button className="btn btn-secondary btn-sm" onClick={handleExport}>
              📤 Export
            </button>
            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
              📥 Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
            <button className="btn btn-primary btn-sm" onClick={handleSyncToGitHub} style={{ marginLeft: '8px' }}>
              🚀 Sync to GitHub
            </button>
          </div>
        </div>
      </div>

      <div className="board-container">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="board">
            {columns.map((column, index) => (
              <Column
                key={column.id}
                column={column}
                tasks={getColumnTasks(column.id)}
                onAddTask={() => handleAddTask(column.id)}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onEditColumn={() => handleEditColumn(column)}
                onDeleteColumn={() => handleDeleteColumn(column.id)}
                onMoveLeft={index > 0 ? () => handleMoveColumn(column.id, 'left') : null}
                onMoveRight={index < columns.length - 1 ? () => handleMoveColumn(column.id, 'right') : null}
                canDelete={columns.length > 1}
              />
            ))}
            <button className="add-column-btn" onClick={handleAddColumn}>
              <span>+</span>
              <span>Add Column</span>
            </button>
          </div>
          <DragOverlay>
            {activeTask && (
              <div className="drag-overlay">
                <TaskCard task={activeTask} isDragging />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => {
            setModalOpen(false)
            setEditingTask(null)
            setSelectedColumn(null)
          }}
        />
      )}

      {columnModalOpen && (
        <ColumnModal
          column={editingColumn}
          colors={COLUMN_COLORS}
          onSave={handleSaveColumn}
          onClose={() => {
            setColumnModalOpen(false)
            setEditingColumn(null)
          }}
        />
      )}

      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </div>
  )
}

export default App
