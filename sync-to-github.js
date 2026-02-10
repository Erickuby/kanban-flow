/**
 * Auto-sync Kanban board data to GitHub
 * Run this after making changes to the board:
 *   node sync-to-github.js "Your commit message"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'public', 'board-data.json');

function commitAndPush(message) {
  try {
    // Add changes
    console.log('📝 Adding changes to git...');
    execSync('git add .', { cwd: __dirname });

    // Commit
    console.log('💾 Committing changes...');
    execSync(`git commit -m "${message}"`, { cwd: __dirname });

    // Push
    console.log('🚀 Pushing to GitHub...');
    execSync('git push', { cwd: __dirname });

    console.log('✅ Successfully synced to GitHub!');
    console.log('🔄 Netlify will auto-deploy shortly...');
  } catch (error) {
    if (error.message.includes('nothing to commit')) {
      console.log('ℹ️ No changes to commit.');
    } else {
      console.error('❌ Error syncing:', error.message);
    }
  }
}

// Get commit message from CLI args or use default
const message = process.argv[2] || 'Update Kanban board';

commitAndPush(message);
