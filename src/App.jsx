import { useState, useEffect, useCallback } from 'react'
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { v4 as uuidv4 } from 'uuid'
import Column from './components/Column'
import TaskCard from './components/TaskCard'
import TaskModal from './components/TaskModal'
import ColumnModal from './components/ColumnModal'
import Toast from './components/Toast'
import { isToday, isTomorrow, isPast, parseISO, differenceInHours, isWithinInterval } from 'date-fns'
import './index.css'

const STORAGE_KEY = 'kanban-board-workspace-v3'
const THEME_KEY = 'kanban-theme'

// Workspaces
const defaultWorkspaces = [
  { id: 'personal', name: 'Personal', icon: '👤' },
  { id: 'work', name: 'Work', icon: '💼' },
  { id: 'learning', name: 'Learning & development', icon: '📚' },
  { id: 'ai-stuff', name: 'AI Stuff', icon: '🤖' },
]

// Column configurations per workspace
const workspaceColumns = {
  personal: [
    { id: 'backlog', title: 'BACKLOG', color: '#6b7280' },
    { id: 'sprint', title: 'SPRINT', color: '#3b82f6' },
    { id: 'in-progress', title: 'IN PROGRESS', color: '#f59e0b' },
    { id: 'blocked', title: 'BLOCKED', color: '#ef4444' },
    { id: 'done', title: 'DONE', color: '#22c55e' },
  ],
  work: [
    { id: 'backlog', title: 'BACKLOG', color: '#6b7280' },
    { id: 'sprint', title: 'SPRINT', color: '#3b82f6' },
    { id: 'in-progress', title: 'IN PROGRESS', color: '#f59e0b' },
    { id: 'blocked', title: 'BLOCKED', color: '#ef4444' },
    { id: 'done', title: 'DONE', color: '#22c55e' },
  ],
  learning: [
    { id: 'backlog', title: 'TO LEARN', color: '#8b5cf6' },
    { id: 'learning', title: 'LEARNING', color: '#06b6d4' },
    { id: 'done', title: 'MASTERED', color: '#22c55e' },
  ],
  'ai-stuff': [
    { id: 'backlog', title: 'BACKLOG', color: '#6b7280' },
    { id: 'sprint', title: 'SPRINT', color: '#3b82f6' },
    { id: 'in-progress', title: 'IN PROGRESS', color: '#f59e0b' },
    { id: 'blocked', title: 'BLOCKED', color: '#ef4444' },
    { id: 'done', title: 'DONE', color: '#22c55e' },
  ],
}

// Default tasks for each workspace
const defaultWorkspaceTasks = {
  'personal': [
    {
      id: uuidv4(),
      title: 'Platform Build',
      description: 'Build The Black Tech Community platform',
      columnId: 'in-progress',
      priority: 'high',
      dueDate: '2026-03-15',
      tags: [{ text: 'B-TNE', color: 'purple' }, { text: 'Dev', color: 'cyan' }],
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
      priority: 'medium',
      dueDate: '2026-03-01',
      tags: [{ text: 'Automation', color: 'green' }],
      subtasks: [],
      createdAt: new Date().toISOString(),
    },
  ],
  'work': [
    {
      id: uuidv4(),
      title: 'Quarterly Report',
      description: 'Complete Q1 2026 portfolio review',
      columnId: 'sprint',
      priority: 'high',
      dueDate: '2026-03-31',
      tags: [{ text: 'DWP', color: 'blue' }],
      subtasks: [],
      createdAt: new Date().toISOString(),
    },
  ],
  'learning': [
    {
      id: uuidv4(),
      title: 'MCP Protocol',
      description: 'Learn Model Context Protocol for Claude integrations',
      columnId: 'learning',
      priority: 'high',
      dueDate: null,
      tags: [{ text: 'AI', color: 'purple' }, { text: 'Claude', color: 'orange' }],
      subtasks: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'TypeScript Advanced',
      description: 'Master generics, inference, and utility types',
      columnId: 'backlog',
      priority: 'medium',
      dueDate: null,
      tags: [{ text: 'Dev', color: 'blue' }],
      subtasks: [],
      createdAt: new Date().toISOString(),
    },
  ],
  'ai-stuff': [
    {
      id: uuidv4(),
      title: 'Video 1: The Manifesto - Why AI Isn\'t Coming for Your Job',
      description: 'The high-level strategy. Why "Gap" exists and why AI is the new Excel. Call out the massive gap between 10x workers and AI-leveraged professionals.',
      columnId: 'sprint',
      priority: 'high',
      dueDate: '2026-02-20',
      tags: [{ text: 'YouTube', color: 'red' }, { text: 'Strategy', color: 'purple' }],
      subtasks: [
        { id: uuidv4(), text: 'Script the Reality Check hook', completed: false },
        { id: uuidv4(), text: 'Record manifesto introduction', completed: false },
        { id: uuidv4(), text: 'Add CTA for playlist subscription', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Video 2: The Foundation - Stop Chatting with AI (CRAFT Framework)',
      description: 'Deep dive into Markdown and CRAFT. Show bad prompt vs CRAFT prompt live. Offer link to Elite Prompt Library in description.',
      columnId: 'backlog',
      priority: 'high',
      dueDate: '2026-02-27',
      tags: [{ text: 'YouTube', color: 'red' }, { text: 'Prompts', color: 'orange' }],
      subtasks: [
        { id: uuidv4(), text: 'Show "Gambling vs Engineering" analogy', completed: false },
        { id: uuidv4(), text: 'Live demo: bad prompt → CRAFT prompt', completed: false },
        { id: uuidv4(), text: 'Create prompt library link', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Video 3: The Super-Learner - Learn New Skill in 24 Hours (NotebookLM)',
      description: 'Take a complex PDF, upload to NotebookLM live, generate podcast. Show how to use it to study fast. Information Overload hook.',
      columnId: 'backlog',
      priority: 'medium',
      dueDate: '2026-03-06',
      tags: [{ text: 'YouTube', color: 'red' }, { text: 'Learning', color: 'cyan' }],
      subtasks: [
        { id: uuidv4(), text: 'Find technical PDF for demo', completed: false },
        { id: uuidv4(), text: 'Record NotebookLM live demo', completed: false },
        { id: uuidv4(), text: 'Show study workflow', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Video 4: The Visual Magic - Built SaaS App in 20 Minutes (No Code)',
      description: 'Viral potential video. Use Lovable or Bolt.new. Build "Automation Business Blueprint" app. Show English → App process. Lesson: No senior dev needed for portfolio.',
      columnId: 'backlog',
      priority: 'high',
      dueDate: '2026-03-13',
      tags: [{ text: 'YouTube', color: 'red' }, { text: 'Vibe Coding', color: 'orange' }],
      subtasks: [
        { id: uuidv4(), text: 'Set up Lovable/Bolt.new project', completed: false },
        { id: uuidv4(), text: 'Record build process (timelapse?)', completed: false },
        { id: uuidv4(), text: 'Show final working app', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Video 5: The Business Build - One-Person Blueprint (7 Steps to £10k/mo)',
      description: 'Walk through 7 steps: Idea → Brand → Site → Content → Leads → Ops → Improve. Use slides, show tools (Namelix, HubSpot) briefly. Dismantle "Big Team" myth.',
      columnId: 'backlog',
      priority: 'high',
      dueDate: '2026-03-20',
      tags: [{ text: 'YouTube', color: 'red' }, { text: 'Business', color: 'green' }],
      subtasks: [
        { id: uuidv4(), text: 'Create 7-step slide deck', completed: false },
        { id: uuidv4(), text: 'Record walkthrough with tool demos', completed: false },
        { id: uuidv4(), text: 'Add CTA: Join Black Tech North East', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Video 6: The Engine - Stop Manual Admin (Build AI Agent Instead)',
      description: 'Technical deep dive. Build specific workflow node-by-node. Explain webhooks and agent decisions. Offer n8n template for free download. Longest video.',
      columnId: 'backlog',
      priority: 'high',
      dueDate: '2026-03-27',
      tags: [{ text: 'YouTube', color: 'red' }, { text: 'n8n', color: 'green' }],
      subtasks: [
        { id: uuidv4(), text: 'Design workflow architecture', completed: false },
        { id: uuidv4(), text: 'Build in n8n node-by-node', completed: false },
        { id: uuidv4(), text: 'Export and host template for download', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Video 7: The Proof Paradox - Get Hired/Clients With Zero Experience',
      description: 'Show "Loom Proof" strategy. Example "Proof" video. Explain "Proof Paradox." Close with CTA: Join Black Tech North East. Bypass gatekeepers strategy.',
      columnId: 'backlog',
      priority: 'high',
      dueDate: '2026-04-03',
      tags: [{ text: 'YouTube', color: 'red' }, { text: 'Career', color: 'purple' }],
      subtasks: [
        { id: uuidv4(), text: 'Explain "Proof Paradox" clearly', completed: false },
        { id: uuidv4(), text: 'Show example Proof video', completed: false },
        { id: uuidv4(), text: 'Community CTA at end', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    // LinkedIn Content Calendar - February 2026
    {
      id: uuidv4(),
      title: 'LinkedIn Post: AI Won\'t Replace You. But Your Colleague Using It Will.',
      description: 'Text-only opinion post. Hook: The gap between 10x workers and AI-leveraged pros. Based on Blueprint Video 1 concept.',
      columnId: 'sprint',
      priority: 'high',
      dueDate: '2026-02-12',
      tags: [{ text: 'LinkedIn', color: 'blue' }, { text: 'Text-Only', color: 'gray' }],
      subtasks: [
        { id: uuidv4(), text: 'Draft post content', completed: false },
        { id: uuidv4(), text: 'Post at 07:30 GMT', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'LinkedIn Post: My AI Stack in 2026 (Screenshot)',
      description: 'Image + text post. Simple screenshot of AI tools with clear value proposition. Consistent branding.',
      columnId: 'sprint',
      priority: 'medium',
      dueDate: '2026-02-14',
      tags: [{ text: 'LinkedIn', color: 'blue' }, { text: 'Image', color: 'cyan' }],
      subtasks: [
        { id: uuidv4(), text: 'Take AI tools screenshot', completed: false },
        { id: uuidv4(), text: 'Draft copy and post at 12:00 GMT', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'LinkedIn Post: 5 AI Tools to Cut Meeting Time by 50% (Carousel)',
      description: 'Educational carousel. 11 slides, one clear idea per slide. Teach practical AI workflow for PMs.',
      columnId: 'backlog',
      priority: 'medium',
      dueDate: '2026-02-17',
      tags: [{ text: 'LinkedIn', color: 'blue' }, { text: 'Carousel', color: 'purple' }],
      subtasks: [
        { id: uuidv4(), text: 'Design 11-slide carousel', completed: false },
        { id: uuidv4(), text: 'Create each slide content', completed: false },
        { id: uuidv4(), text: 'Post at 08:00 GMT', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'LinkedIn Post: I Failed Using AI for 6 Months. Here\'s What I Learned.',
      description: 'Transparent story post. Raw, honest about AI struggles. High engagement format.',
      columnId: 'backlog',
      priority: 'medium',
      dueDate: '2026-02-19',
      tags: [{ text: 'LinkedIn', color: 'blue' }, { text: 'Story', color: 'yellow' }],
      subtasks: [
        { id: uuidv4(), text: 'Write honest story about failure', completed: false },
        { id: uuidv4(), text: 'Share lessons learned', completed: false },
        { id: uuidv4(), text: 'Post at 17:30 GMT', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'LinkedIn Post: B-TNE Is Looking for Speakers: AI, Tech Career Topics',
      description: 'Hiring/community post. Promotes B-TNE growth. Triggers comments and shares.',
      columnId: 'backlog',
      priority: 'high',
      dueDate: '2026-02-21',
      tags: [{ text: 'LinkedIn', color: 'blue' }, { text: 'B-TNE', color: 'purple' }],
      subtasks: [
        { id: uuidv4(), text: 'Draft call for speakers', completed: false },
        { id: uuidv4(), text: 'Include clear CTA', completed: false },
        { id: uuidv4(), text: 'Post at 07:30 GMT', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'LinkedIn Post: Stop \'Chatting\' With AI. Start Engineering Results.',
      description: 'Text-only opinion post. Based on Blueprint Video 2 (CRAFT Framework). Gambling vs. Engineering analogy.',
      columnId: 'backlog',
      priority: 'medium',
      dueDate: '2026-02-25',
      tags: [{ text: 'LinkedIn', color: 'blue' }, { text: 'Text-Only', color: 'gray' }],
      subtasks: [
        { id: uuidv4(), text: 'Draft CRAFT framework explanation', completed: false },
        { id: uuidv4(), text: 'Include gambling vs engineering hook', completed: false },
        { id: uuidv4(), text: 'Post at 07:30 GMT', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'LinkedIn Post: My n8n Workflow: Automate Weekly Reports in 10 Mins (Carousel)',
      description: 'Educational carousel. Step-by-step n8n workflow demo. One clear idea per slide. Practical value.',
      columnId: 'backlog',
      priority: 'high',
      dueDate: '2026-02-27',
      tags: [{ text: 'LinkedIn', color: 'blue' }, { text: 'Carousel', color: 'purple' }, { text: 'n8n', color: 'green' }],
      subtasks: [
        { id: uuidv4(), text: 'Record n8n workflow demo', completed: false },
        { id: uuidv4(), text: 'Create 10-12 slide carousel', completed: false },
        { id: uuidv4(), text: 'Post at 12:00 GMT', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'LinkedIn Post: From 10-Hour Days to 4-Hour Days: My AI Journey',
      description: 'Transparent story post. Before/after narrative using AI. Shows transformation, builds credibility.',
      columnId: 'backlog',
      priority: 'medium',
      dueDate: '2026-02-28',
      tags: [{ text: 'LinkedIn', color: 'blue' }, { text: 'Story', color: 'yellow' }],
      subtasks: [
        { id: uuidv4(), text: 'Write before/after story', completed: false },
        { id: uuidv4(), text: 'Include concrete time savings', completed: false },
        { id: uuidv4(), text: 'Post at 17:30 GMT', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
  ],
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark')

  const [workspaces] = useState(() => defaultWorkspaces)
  const [activeWorkspace, setActiveWorkspace] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        return data.activeWorkspace || 'ai-stuff'
      } catch {
        return 'ai-stuff'
      }
    }
    return 'ai-stuff'
  })

  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        return data.columns || workspaceColumns[activeWorkspace]
      } catch {
        return workspaceColumns[activeWorkspace]
      }
    }
    return workspaceColumns[activeWorkspace]
  })

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        return data.tasks || defaultWorkspaceTasks[activeWorkspace] || []
      } catch {
        return defaultWorkspaceTasks[activeWorkspace] || []
      }
    }
    return defaultWorkspaceTasks[activeWorkspace] || []
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      columns,
      tasks,
      activeWorkspace,
    }))
  }, [columns, tasks, activeWorkspace])

  // Switch workspace
  const handleWorkspaceSwitch = (workspaceId) => {
    setActiveWorkspace(workspaceId)
    setColumns(workspaceColumns[workspaceId])
    setTasks(defaultWorkspaceTasks[workspaceId] || [])
    setSearchQuery('')
    setPriorityFilter('all')
    setTagFilter('all')
  }

  // Check for due date reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      tasks.forEach(task => {
        if (!task.dueDate || task.columnId === 'done') return

        const dueDate = parseISO(task.dueDate)
        const hoursUntilDue = differenceInHours(dueDate, now)

        if (hoursUntilDue > 0 && hoursUntilDue <= 24) {
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
    const interval = setInterval(checkReminders, 60000)
    return () => clearInterval(interval)
  }, [tasks])

  const addToast = useCallback((toast) => {
    const id = uuidv4()
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  // Drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task)
    setIsWorking(true)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveTask(null)
    setTimeout(() => setIsWorking(false), 500)

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
    const fallbackColumn = columns.find(c => c.id !== columnId)?.id || columns[0]?.id
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
    const data = JSON.stringify({ columns, tasks, activeWorkspace }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kanban-backup-${activeWorkspace}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    addToast({ type: 'success', title: 'Exported!', message: 'Your board has been downloaded' })
  }

  const handleSyncToGitHub = () => {
    const data = JSON.stringify({ columns, tasks, activeWorkspace }, null, 2)
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
  }

  const handleImport = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.columns && data.tasks) {
          setColumns(data.columns)
          setTasks(data.tasks)
          if (data.activeWorkspace) {
            setActiveWorkspace(data.activeWorkspace)
          }
          addToast({ type: 'success', title: 'Imported!', message: 'Board data has been loaded' })
        }
      } catch (error) {
        addToast({ type: 'error', title: 'Import Failed', message: 'Invalid file format' })
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  // Filtering
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

  // Stats calculation
  const stats = {
    total: tasks.length,
    overdue: tasks.filter(t => {
      if (!t.dueDate || t.columnId === 'done') return false
      return isPast(parseISO(t.dueDate))
    }).length,
    dueToday: tasks.filter(t => {
      if (!t.dueDate || t.columnId === 'done') return false
      return isToday(parseISO(t.dueDate))
    }).length,
    completed: tasks.filter(t => t.columnId === 'done').length,
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="app workspace-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Workspaces</h2>
          <button className="add-workspace-btn" title="Add workspace">+</button>
        </div>
        <nav className="workspace-nav">
          {workspaces.map(workspace => (
            <button
              key={workspace.id}
              className={`workspace-item ${activeWorkspace === workspace.id ? 'active' : ''}`}
              onClick={() => handleWorkspaceSwitch(workspace.id)}
            >
              <span className="workspace-icon">{workspace.icon}</span>
              <span className="workspace-name">{workspace.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <div className={`status-indicator ${isWorking ? 'working' : ''}`}>
              <span>{isWorking ? '💪' : '💤'}</span>
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
            <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="icon-btn" onClick={handleExport} title="Export">
              📤
            </button>
            <button className="icon-btn" onClick={handleSyncToGitHub} title="Sync to GitHub">
              🚀
            </button>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value overdue">{stats.overdue}</span>
            <span className="stat-label">Overdue</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.dueToday}</span>
            <span className="stat-label">Due today</span>
          </div>
          <div className="stat-item">
            <span className="stat-value completed">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
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

          <button className="btn btn-primary" onClick={() => handleAddTask(columns[0]?.id)}>
            + Add Task
          </button>
        </div>

        {/* Board */}
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
                + Add Column
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
      </main>

      {/* Modals */}
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
          onSave={handleSaveColumn}
          onClose={() => {
            setColumnModalOpen(false)
            setEditingColumn(null)
          }}
        />
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </div>
    </div>
  )
}

export default App
