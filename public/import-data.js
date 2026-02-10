const data = {
  "columns": [
    { "id": "backlog", "title": "Backlog", "color": "#6b7280" },
    { "id": "todo", "title": "To Do", "color": "#3b82f6" },
    { "id": "in-progress", "title": "In Progress", "color": "#f59e0b" },
    { "id": "review", "title": "Review", "color": "#a855f7" },
    { "id": "done", "title": "Done", "color": "#22c55e" }
  ],
  "tasks": [
    {
      "id": "yt-rebrand-001",
      "title": "Rebrand YouTube Channel",
      "description": "Rebrand to 'Eric Explains AI' - The Missing Manual. Dark mode aesthetic, builder-focused.",
      "columnId": "todo",
      "priority": "high",
      "dueDate": "2026-02-12",
      "tags": [{ "text": "YouTube", "color": "pink" }, { "text": "Branding", "color": "purple" }],
      "subtasks": [
        { "id": "sub-001", "text": "Change channel name to 'Eric Explains AI'", "completed": false },
        { "id": "sub-002", "text": "Update profile picture (your face, clean background)", "completed": false },
        { "id": "sub-003", "text": "Create new banner - dark mode, 'The Missing Manual' tagline", "completed": false },
        { "id": "sub-004", "text": "Rewrite About section for builders (Devs, PMs, Solopreneurs)", "completed": false },
        { "id": "sub-005", "text": "Update handle to @EricExplainsAI", "completed": false }
      ],
      "createdAt": "2026-02-09T20:35:00.000Z"
    },
    {
      "id": "yt-video-001",
      "title": "Video 1: Build a Client Portal in 45 Minutes with Lovable",
      "description": "Vibe Coding tutorial for freelancers/agencies. Build login, project status, file uploads, messaging.",
      "columnId": "backlog",
      "priority": "high",
      "dueDate": "2026-02-16",
      "tags": [{ "text": "YouTube", "color": "pink" }, { "text": "Vibe Coding", "color": "cyan" }],
      "subtasks": [
        { "id": "v1-001", "text": "Plan app features (login, dashboard, files, messaging)", "completed": false },
        { "id": "v1-002", "text": "Write script with step-by-step walkthrough", "completed": false },
        { "id": "v1-003", "text": "Record screen + voiceover", "completed": false },
        { "id": "v1-004", "text": "Edit video", "completed": false },
        { "id": "v1-005", "text": "Create thumbnail (before/after split, dark mode)", "completed": false },
        { "id": "v1-006", "text": "Upload and publish", "completed": false }
      ],
      "createdAt": "2026-02-09T22:30:00.000Z"
    },
    {
      "id": "yt-video-002",
      "title": "Video 2: Automate Lead Enrichment with n8n + Hunter.io + GPT-4",
      "description": "n8n tutorial for sales teams. Form → scrape data → enrich with AI → push to CRM.",
      "columnId": "backlog",
      "priority": "high",
      "dueDate": "2026-02-23",
      "tags": [{ "text": "YouTube", "color": "pink" }, { "text": "n8n", "color": "orange" }],
      "subtasks": [
        { "id": "v2-001", "text": "Set up n8n workflow structure", "completed": false },
        { "id": "v2-002", "text": "Write script", "completed": false },
        { "id": "v2-003", "text": "Record tutorial", "completed": false },
        { "id": "v2-004", "text": "Create thumbnail (workflow diagram style)", "completed": false },
        { "id": "v2-005", "text": "Upload and publish", "completed": false }
      ],
      "createdAt": "2026-02-09T22:30:00.000Z"
    },
    {
      "id": "yt-video-003",
      "title": "Video 3: Build a SaaS MVP in One Afternoon with Bolt.new",
      "description": "Vibe Coding for solopreneurs. Landing page + waitlist + basic dashboard in 4 hours.",
      "columnId": "backlog",
      "priority": "medium",
      "dueDate": "2026-03-02",
      "tags": [{ "text": "YouTube", "color": "pink" }, { "text": "Vibe Coding", "color": "cyan" }],
      "subtasks": [
        { "id": "v3-001", "text": "Choose MVP idea to build", "completed": false },
        { "id": "v3-002", "text": "Write script", "completed": false },
        { "id": "v3-003", "text": "Record build session", "completed": false },
        { "id": "v3-004", "text": "Edit and publish", "completed": false }
      ],
      "createdAt": "2026-02-09T22:30:00.000Z"
    },
    {
      "id": "yt-video-004",
      "title": "Video 4: Create an AI Agent That Books Meetings (n8n + Calendly)",
      "description": "AI agent for coaches/consultants. AI reads emails → suggests times → books via Calendly.",
      "columnId": "backlog",
      "priority": "medium",
      "dueDate": "2026-03-09",
      "tags": [{ "text": "YouTube", "color": "pink" }, { "text": "n8n", "color": "orange" }, { "text": "AI Agents", "color": "purple" }],
      "subtasks": [
        { "id": "v4-001", "text": "Build n8n workflow", "completed": false },
        { "id": "v4-002", "text": "Write script", "completed": false },
        { "id": "v4-003", "text": "Record and publish", "completed": false }
      ],
      "createdAt": "2026-02-09T22:30:00.000Z"
    },
    {
      "id": "yt-video-005",
      "title": "Video 5: Build an Internal Tool in 30 Minutes with Replit Agent",
      "description": "For dev teams. Data viewer, search, export — built from a prompt.",
      "columnId": "backlog",
      "priority": "medium",
      "dueDate": "2026-03-16",
      "tags": [{ "text": "YouTube", "color": "pink" }, { "text": "Vibe Coding", "color": "cyan" }],
      "subtasks": [],
      "createdAt": "2026-02-09T22:30:00.000Z"
    },
    {
      "id": "yt-video-006",
      "title": "Video 6: Automate Your Weekly Report with n8n + Notion + GPT-4",
      "description": "For PMs. Pull tasks from Notion → AI summarizes → sends email automatically.",
      "columnId": "backlog",
      "priority": "medium",
      "dueDate": "2026-03-23",
      "tags": [{ "text": "YouTube", "color": "pink" }, { "text": "n8n", "color": "orange" }],
      "subtasks": [],
      "createdAt": "2026-02-09T22:30:00.000Z"
    },
    {
      "id": "yt-video-007",
      "title": "Video 7: Build a Customer Feedback Dashboard with Lovable",
      "description": "For startups. Feedback form + sentiment analysis + dashboard without expensive tools.",
      "columnId": "backlog",
      "priority": "low",
      "dueDate": "2026-03-30",
      "tags": [{ "text": "YouTube", "color": "pink" }, { "text": "Vibe Coding", "color": "cyan" }],
      "subtasks": [],
      "createdAt": "2026-02-09T22:30:00.000Z"
    },
    {
      "id": "yt-video-008",
      "title": "Video 8: Connect Claude to Your Tools with MCP (Practical Guide)",
      "description": "For devs. Claude connected to database + Slack + custom API via Model Context Protocol.",
      "columnId": "backlog",
      "priority": "low",
      "dueDate": "2026-04-06",
      "tags": [{ "text": "YouTube", "color": "pink" }, { "text": "AI Agents", "color": "purple" }],
      "subtasks": [],
      "createdAt": "2026-02-09T22:30:00.000Z"
    },
    {
      "id": "yt-video-009",
      "title": "Video 9: Build a Quote Generator for Freelancers with Bolt.new",
      "description": "Form input → auto-generate PDF quote → email to client. 10 min setup.",
      "columnId": "backlog",
      "priority": "low",
      "dueDate": "2026-04-13",
      "tags": [{ "text": "YouTube", "color": "pink" }, { "text": "Vibe Coding", "color": "cyan" }],
      "subtasks": [],
      "createdAt": "2026-02-09T22:30:00.000Z"
    },
    {
      "id": "yt-video-010",
      "title": "Video 10: Create a Personal CRM with n8n + Airtable + AI",
      "description": "For solopreneurs. Auto-log meetings/emails → AI suggests follow-ups.",
      "columnId": "backlog",
      "priority": "low",
      "dueDate": "2026-04-20",
      "tags": [{ "text": "YouTube", "color": "pink" }, { "text": "n8n", "color": "orange" }],
      "subtasks": [],
      "createdAt": "2026-02-09T22:30:00.000Z"
    },
    {
      "id": "seminar-done-001",
      "title": "B-TNE Seminar - AI for Tech Careers",
      "description": "First seminar completed! 48 attendees, 2.5 hours, huge success.",
      "columnId": "done",
      "priority": "high",
      "dueDate": "2026-02-08",
      "tags": [{ "text": "B-TNE", "color": "purple" }],
      "subtasks": [
        { "id": "sem-001", "text": "Create slide deck", "completed": true },
        { "id": "sem-002", "text": "Prepare demo", "completed": true },
        { "id": "sem-003", "text": "Practice run-through", "completed": true },
        { "id": "sem-004", "text": "Deliver seminar", "completed": true }
      ],
      "createdAt": "2026-02-01T00:00:00.000Z"
    },
    {
      "id": "existing-002",
      "title": "Community Growth Strategy",
      "description": "Plan outreach to grow B-TNE from 20 to 50+ members. Leverage seminar success.",
      "columnId": "backlog",
      "priority": "medium",
      "dueDate": "2026-02-28",
      "tags": [{ "text": "B-TNE", "color": "purple" }, { "text": "Strategy", "color": "blue" }],
      "subtasks": [],
      "createdAt": "2026-02-09T00:00:00.000Z"
    },
    {
      "id": "existing-003",
      "title": "Platform Build - The Black Tech Community",
      "description": "Build The Black Tech Community platform",
      "columnId": "in-progress",
      "priority": "high",
      "dueDate": "2026-03-15",
      "tags": [{ "text": "Dev", "color": "cyan" }],
      "subtasks": [
        { "id": "plat-001", "text": "Design mockups", "completed": true },
        { "id": "plat-002", "text": "Set up database", "completed": true },
        { "id": "plat-003", "text": "Build authentication", "completed": false },
        { "id": "plat-004", "text": "Create dashboard", "completed": false }
      ],
      "createdAt": "2026-02-09T00:00:00.000Z"
    },
    {
      "id": "existing-004",
      "title": "LinkedIn Content Calendar",
      "description": "Create weekly content plan - repurpose YouTube videos into LinkedIn posts for builders.",
      "columnId": "todo",
      "priority": "medium",
      "dueDate": "2026-02-14",
      "tags": [{ "text": "Content", "color": "orange" }, { "text": "LinkedIn", "color": "blue" }],
      "subtasks": [],
      "createdAt": "2026-02-09T00:00:00.000Z"
    },
    {
      "id": "existing-005",
      "title": "n8n Workflow Templates",
      "description": "Package and document automation workflows for sale. Start with lead gen + CRM workflows.",
      "columnId": "backlog",
      "priority": "medium",
      "dueDate": "2026-03-01",
      "tags": [{ "text": "n8n", "color": "orange" }, { "text": "Product", "color": "green" }],
      "subtasks": [],
      "createdAt": "2026-02-09T00:00:00.000Z"
    }
  ]
};

localStorage.setItem('kanban-board-data', JSON.stringify(data));
console.log('Builder content strategy imported!');
location.reload();
