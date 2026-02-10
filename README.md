# Kanban Flow - Eric's AI Content Board

A personal Kanban board for managing Eric Nwankwo's AI content strategy. Built with React + Vite.

## Features

- **5 Columns:** Backlog → To Do → In Progress → Review → Done
- **Drag & Drop:** Move tasks between columns with dnd-kit
- **Subtasks:** Track progress with checklists
- **Due Dates:** Toast notifications for upcoming deadlines
- **Priority & Tag Filters:** Find tasks quickly
- **Dark/Light Theme:** Toggle between modes
- **Status Indicator:** Shows when working vs idle
- **Export/Import:** Backup your board to JSON
- **Local Storage:** Persists data between sessions

## Current Projects

**"Eric Explains AI" — The Missing Manual**

1. B-TNE Seminar Prep ✅ (Completed - 48 attendees, 2.5 hours)
2. YouTube Channel Setup ✅ (Completed)
3. Platform Build 🔄 (In Progress)
4. Video 1: Client Portal with Lovable (To Do)
5. Videos 2-10 (Backlog - n8n, Bolt.new, MCP topics)

## Local Development

```bash
cd kanban-app
npm install
npm run dev
```

Open http://localhost:5173

## Deployment

### GitHub
https://github.com/Erickuby/kanban-flow

### Netlify Setup

1. Go to https://app.netlify.com/start
2. Connect your GitHub account
3. Import the `Erickuby/kanban-flow` repository
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Deploy!

The board will be auto-deployed on every push to GitHub.

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **dnd-kit** - Drag & drop
- **date-fns** - Date utilities
- **Tailwind CSS** - Styling (via inline styles)

---

Built by Eric Nwankwo for "Eric Explains AI" — the patient teacher for builders.
