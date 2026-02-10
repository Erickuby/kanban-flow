/**
 * Auto-sync watcher for Kanban board
 * Monitors board-data.json and auto-commits/pushes to GitHub
 *
 * Run: node auto-sync.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_FILE = path.join(__dirname, 'public', 'board-data.json');
let lastModified = fs.existsSync(DATA_FILE) ? fs.statSync(DATA_FILE).mtimeMs : 0;

console.log('👀 Watching for board changes...');
console.log(`📁 Monitoring: ${DATA_FILE}`);
console.log('Press Ctrl+C to stop\n');

// Watch function
function watchAndSync() {
  if (!fs.existsSync(DATA_FILE)) {
    console.log('⏳ Waiting for board-data.json to be created...');
    setTimeout(watchAndSync, 5000);
    return;
  }

  const currentModified = fs.statSync(DATA_FILE).mtimeMs;

  if (currentModified > lastModified) {
    lastModified = currentModified;
    console.log(`📝 Change detected at ${new Date().toLocaleTimeString()}`);

    try {
      // Add changes
      execSync('git add .', { cwd: __dirname, stdio: 'pipe' });

      // Check if there are changes to commit
      const status = execSync('git status --porcelain', { cwd: __dirname, encoding: 'utf8' });

      if (status.trim()) {
        const message = `Update board - ${new Date().toLocaleString()}`;
        execSync(`git commit -m "${message}"`, { cwd: __dirname, stdio: 'pipe' });
        execSync('git push', { cwd: __dirname, stdio: 'pipe' });
        console.log(`✅ Synced to GitHub at ${new Date().toLocaleTimeString()}`);
        console.log('🔄 Netlify will auto-deploy...\n');
      } else {
        console.log('ℹ️ No actual changes detected.\n');
      }
    } catch (error) {
      console.error('❌ Sync error:', error.message);
    }
  }

  // Check every 5 seconds
  setTimeout(watchAndSync, 5000);
}

watchAndSync();
