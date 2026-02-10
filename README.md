# Kanban Flow 📋

**Eric Nwankwo's Personal Kanban Board** — Managing the "Eric Explains AI" content strategy and projects.

![Status Indicator](https://img.shields.io/badge/status-active-success)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7.3.1-purple)

---

## 🎯 Overview

Kanban Flow is a personal productivity board built for managing Eric Nwankwo's content strategy across:
- **YouTube Channel** — "Eric Explains AI" (10 video series)
- **The Black Tech Community** — Platform build & growth
- **Automation Workflows** — n8n templates & tutorials
- **Personal Projects** — Career scaling & affiliate marketing

### Brand: "Eric Explains AI" — The Missing Manual

> *"The patient teacher for builders who want to actually use AI — not just talk about it."*

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Drag & Drop** | Move tasks between columns with dnd-kit |
| **5 Columns** | Backlog → To Do → In Progress → Review → Done |
| **Subtasks** | Track progress with checklists and progress bars |
| **Due Dates** | Toast notifications for deadlines (24h, today, tomorrow) |
| **Filters** | Filter by priority (High/Medium/Low) and tags |
| **Search** | Find tasks instantly |
| **Status Indicator** | 💤 Idle / 💪 Working status in header |
| **Themes** | Dark mode default, light mode available |
| **Export/Import** | Backup board data to JSON |
| **Local Storage** | Persists data between sessions |
| **Column Customization** | Add, rename, reorder, delete columns |

---

## 📊 Current Board Status

### Done ✅
- [x] **B-TNE Seminar Prep** — AI career scaling talk (Feb 8, 2026)
  - Result: 48 attendees, 2.5 hours, massive success
- [x] **YouTube Channel Setup & Rebrand** — "Eric Explains AI"
  - Channel name, banner, description updated
  - Thumbnail template system created
  - Video playlist structure set up

### In Progress 🔄
- **Platform Build** — The Black Tech Community website
  - Design mockups ✅
  - Database ✅
  - Authentication (pending)
  - Dashboard (pending)

### To Do 📝
- **Video 1:** Build a Client Portal in 45 Minutes with Lovable
  - Write script, build app, record, thumbnail, publish

### Backlog 📦
- Videos 2-10 (n8n, Bolt.new, Replit, MCP topics)
- Community Growth Strategy (20 → 50 members)
- n8n Workflow Templates (package for sale)
- Google Sites Project (TBD)

---

## 🎬 Video Production Schedule

| Week | Video Topic | Platform | Due |
|------|-------------|----------|-----|
| Feb 10-16 | Channel rebrand + **Video 1** (Client Portal) | YouTube | Feb 16 |
| Feb 17-23 | **Video 2** (Lead Enrichment n8n) | YouTube + LinkedIn | Feb 23 |
| Feb 24-Mar 2 | **Video 3** (SaaS MVP with Bolt.new) | YouTube + X thread | Mar 2 |
| Mar 3-9 | **Video 4** (AI Meeting Booker) | YouTube | Mar 9 |
| Mar 10-16 | **Video 5** (Internal Tool with Replit) | YouTube | Mar 16 |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite 7.3.1** | Build tool & dev server |
| **dnd-kit** | Drag & drop library |
| **date-fns** | Date formatting & calculations |
| **Tailwind CSS** | Utility-first styling (inline styles) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (recommend v20+)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/Erickuby/kanban-flow.git
cd kanban-flow

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the board.

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 📦 Deployment

### GitHub Repository
https://github.com/Erickuby/kanban-flow

### Netlify Deployment

1. Go to [Netlify Start](https://app.netlify.com/start)
2. Connect your **GitHub** account
3. Import the **`Erickuby/kanban-flow`** repository
4. Configure build settings:
   ```
   Build command:    npm run build
   Publish directory:  dist
   ```
5. Click **Deploy site**

Netlify will provide a URL like `https://kanban-flow.netlify.app`

### Continuous Deployment

Every push to the `master` branch triggers an automatic Netlify deploy:

```bash
git add .
git commit -m "Update board"
git push
```

---

## 🎨 Customization

### Adding New Tasks

Tasks are initialized in `src/App.jsx` under `defaultTasks`. Each task structure:

```javascript
{
  id: uuidv4(),
  title: 'Task Title',
  description: 'Task description',
  columnId: 'todo', // backlog, todo, in-progress, review, done
  priority: 'high',  // high, medium, low
  dueDate: '2026-02-28',
  tags: [{ text: 'YouTube', color: 'red' }],
  subtasks: [
    { id: uuidv4(), text: 'Subtask 1', completed: false },
  ],
  createdAt: new Date().toISOString(),
}
```

### Theme Colors

Customize colors in `src/App.jsx`:

```javascript
const COLUMN_COLORS = [
  '#6b7280', '#3b82f6', '#f59e0b', '#a855f7', '#22c55e',
  '#ef4444', '#ec4899', '#06b6d4', '#f97316', '#8b5cf6'
]
```

### Status Indicator

The status indicator automatically toggles:
- **💤 Idle** — Default state
- **💪 Working** — Temporarily shows when saving/updating tasks

Controlled via `isWorking` state in `App.jsx`.

---

## 📁 Project Structure

```
kanban-flow/
├── public/
│   ├── vite.svg
│   └── import-data.js
├── src/
│   ├── components/
│   │   ├── Column.jsx       # Column layout & task list
│   │   ├── ColumnModal.jsx  # Add/edit columns
│   │   ├── TaskCard.jsx     # Task card with drag handle
│   │   ├── TaskModal.jsx    # Add/edit tasks
│   │   └── Toast.jsx        # Notification system
│   ├── App.css              # App styles
│   ├── App.jsx              # Main app component & state
│   ├── index.css            # Global styles & theme variables
│   └── main.jsx             # React entry point
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🧠 Content Strategy Reference

Full strategy available at: `C:\Users\ericc\clawd\content-ideas.md`

### Content Pillars
1. **n8n Automation Tutorials** — Workflow builds with real outcomes
2. **Vibe Coding** (Lovable, Bolt.new, Replit) — Build apps without deep coding
3. **Agentic Workflows** — AI agents that actually work (MCP, Claude Code)
4. **Career Scaling** — Leverage AI to level up professionally

### Video Format
- **Title Pattern:** "Build [Specific Thing] in [Time] with [Tool]"
- **Length:** 15-30 minutes
- **Style:** Screen share, calm walkthrough, no fluff
- **Thumbnail:** Dark mode, before/after split, time badge

### What We DON'T Cover
❌ Consumer trends (caricatures, celebrity AI voices)
❌ Apple/Siri news
❌ Viral gimmicks
❌ "10 AI tools you NEED" listicles without depth

---

## 🤝 Contributing

This is a personal project for Eric Nwankwo's workflow. Feel free to fork and adapt for your own use!

---

## 📄 License

MIT License — Use, modify, and distribute freely.

---

## 👤 Author

**Eric Nwankwo**  
Digital Portfolio Manager @ DWP Digital  
Co-founder, The Black Tech Community  

- **LinkedIn:** [@ericnwankwo](https://linkedin.com/in/ericnwankwo)
- **GitHub:** [@Erickuby](https://github.com/Erickuby)
- **YouTube:** Eric Explains AI

---

## 🙏 Acknowledgments

- **Vite** — Lightning-fast build tool
- **dnd-kit** — Accessible drag & drop
- **React** — The library for building UIs

---

*"No hype. High utility. The Missing Manual."*
