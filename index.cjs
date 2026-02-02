#!/usr/bin/env node

/**
 * Google Keep CLI for OpenClaw
 * 
 * Usage:
 *   node google-keep.js <command> [options]
 * 
 * Commands:
 *   list              List all notes
 *   get <note-id>     Get a specific note
 *   create            Create a new note
 *   delete <note-id>  Delete a note
 *   share <note-id>  Share a note with someone
 */

const API_BASE = 'https://keep.googleapis.com/v1';
const SCOPES = ['https://www.googleapis.com/auth/keep'];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

function colorize(text, color) {
  return `${color}${text}${colors.reset}`;
}

async function getAccessToken() {
  // Try to get token from environment or gcloud
  try {
    const { execSync } = require('child_process');
    // Try gcloud command first
    const token = execSync('gcloud auth print-access-token', { encoding: 'utf-8' }).trim();
    if (token) return token;
  } catch (e) {
    // gcloud not available, continue
  }
  
  // Try environment variable
  const envToken = process.env.GOOGLE_ACCESS_TOKEN;
  if (envToken) return envToken;
  
  throw new Error('No Google access token found. Please run "gcloud auth application-default login" or set GOOGLE_ACCESS_TOKEN environment variable.');
}

async function makeRequest(endpoint, method = 'GET', body = null) {
  const token = await getAccessToken();
  
  const fetch = (await import('node-fetch')).default;
  
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  
  return response.json();
}

async function listNotes(options = {}) {
  let endpoint = '/notes';
  const params = new URLSearchParams();
  
  if (options.limit) params.append('pageSize', options.limit);
  if (options.filter) params.append('filter', options.filter);
  if (options.pageToken) params.append('pageToken', options.pageToken);
  
  if (params.toString()) endpoint += `?${params.toString()}`;
  
  const data = await makeRequest(endpoint);
  
  if (!data.notes || data.notes.length === 0) {
    console.log(colorize('No notes found.', colors.yellow));
    return;
  }
  
  console.log(colorize('\n📝 Your Google Keep Notes\n', colors.bright + colors.cyan));
  
  data.notes.forEach((note, index) => {
    const title = note.title || '(No title)';
    const date = new Date(note.updateTime).toLocaleString();
    const truncated = note.body?.text?.text?.substring(0, 50) || '';
    
    console.log(`${index + 1}. ${colorize(title, colors.bright)}`);
    console.log(`   ${colorize('🕐', colors.dim)} ${date}`);
    if (truncated) {
      console.log(`   ${colorize('📄', colors.dim)} ${truncated}...`);
    }
    console.log(`   ${colorize('🆔', colors.dim)} ${note.name.replace('notes/', '')}`);
    console.log('');
  });
  
  if (data.nextPageToken) {
    console.log(colorize(`→ More notes available. Use --page-token ${data.nextPageToken} to see more.`, colors.cyan));
  }
  
  return data;
}

async function getNote(noteId) {
  const data = await makeRequest(`/notes/${noteId}`);
  
  console.log(colorize(`\n📝 ${data.title || '(No title)'}\n`, colors.bright + colors.cyan));
  
  // Show metadata
  console.log(`${colorize('🆔 ID:', colors.dim)} ${data.name}`);
  console.log(`${colorize('🕐 Created:', colors.dim)} ${new Date(data.createTime).toLocaleString()}`);
  console.log(`${colorize('✏️ Updated:', colors.dim)} ${new Date(data.updateTime).toLocaleString()}`);
  
  if (data.trashed) {
    console.log(colorize(`\n⚠️ This note is in trash and will be deleted.\n`, colors.yellow));
  }
  
  // Show body
  if (data.body) {
    console.log(colorize('\n📄 Content:', colors.bright));
    console.log('─'.repeat(40));
    
    if (data.body.text) {
      console.log(data.body.text.text);
    } else if (data.body.list) {
      data.body.list.listItems.forEach((item, index) => {
        const checkbox = item.checked ? '☑' : '☐';
        const indent = item.childListItems?.length ? '  ' : '';
        console.log(`${indent}${checkbox} ${item.text.text}`);
        if (item.childListItems) {
          item.childListItems.forEach(child => {
            console.log(`  ${child.checked ? '☑' : '☐'} ${child.text.text}`);
          });
        }
      });
    }
    
    console.log('─'.repeat(40));
  }
  
  // Show attachments
  if (data.attachments?.length) {
    console.log(colorize(`\n📎 Attachments: ${data.attachments.length}`, colors.bright));
    data.attachments.forEach(att => {
      console.log(`   - ${att.name.split('/').pop()} (${att.mimeType?.join(', ')})`);
    });
  }
  
  return data;
}

async function createNote(options = {}) {
  if (!options.title && !options.text && !options.listItem) {
    throw new Error('Please provide at least a title or content.');
  }
  
  const note = {};
  
  if (options.title) {
    note.title = options.title;
  }
  
  // Build body
  if (options.text) {
    note.body = {
      text: {
        text: options.text
      }
    };
  } else if (options.listItem) {
    const listItems = options.listItem.map(item => ({
      text: { text: item },
      checked: false
    }));
    
    note.body = {
      list: {
        listItems
      }
    };
  }
  
  const data = await makeRequest('/notes', 'POST', note);
  
  console.log(colorize('\n✅ Note created successfully!', colors.green));
  console.log(`${colorize('🆔', colors.dim)} ${data.name}`);
  console.log(`${colorize('📝', colors.dim)} ${data.title || '(No title)'}`);
  
  return data;
}

async function deleteNote(noteId, force = false) {
  if (!force) {
    console.log(colorize(`\n⚠️ About to delete note: ${noteId}`, colors.yellow));
    console.log(colorize('This action cannot be undone.', colors.dim));
  }
  
  await makeRequest(`/notes/${noteId}`, 'DELETE');
  
  console.log(colorize('\n✅ Note deleted successfully!', colors.green));
}

async function shareNote(noteId, options = {}) {
  if (!options.email && !options.emails) {
    throw new Error('Please provide an email address with --email');
  }
  
  const permissions = options.emails 
    ? options.emails.split(',').map(email => ({
        email,
        role: options.role || 'WRITER'
      }))
    : [{
        email: options.email,
        role: options.role || 'WRITER'
      }];
  
  const requests = permissions.map(permission => ({
    parent: `notes/${noteId}`,
    permission
  }));
  
  const data = await makeRequest(`/notes/${noteId}/permissions:batchCreate`, 'POST', {
    requests
  });
  
  console.log(colorize('\n✅ Permissions created successfully!', colors.green));
  data.permissions.forEach(p => {
    console.log(`   ${p.role} → ${p.email || p.user?.email || p.group?.email}`);
  });
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  // Parse remaining arguments
  const options = {};
  let i = 1;
  
  while (i < args.length) {
    const arg = args[i];
    const next = args[i + 1];
    
    if (arg.startsWith('--')) {
      const key = arg.replace('--', '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      
      if (next && !next.startsWith('--')) {
        options[key] = next;
        i += 2;
      } else {
        options[key] = true;
        i += 1;
      }
    } else if (!command || (command !== 'get' && command !== 'delete' && command !== 'share')) {
      // This is the note ID for get/delete/share
      options.id = arg;
      i += 1;
    } else {
      i += 1;
    }
  }
  
  try {
    switch (command) {
      case 'list':
        await listNotes(options);
        break;
        
      case 'get':
        if (!options.id) {
          throw new Error('Please provide a note ID');
        }
        await getNote(options.id);
        break;
        
      case 'create':
        await createNote(options);
        break;
        
      case 'delete':
        if (!options.id) {
          throw new Error('Please provide a note ID');
        }
        await deleteNote(options.id, options.force);
        break;
        
      case 'share':
        if (!options.id) {
          throw new Error('Please provide a note ID');
        }
        await shareNote(options.id, options);
        break;
        
      default:
        console.log(`
${colorize('Google Keep CLI', colors.bright + colors.cyan)}

${colorize('Usage:', colors.bright)}
  google-keep <command> [options]

${colorize('Commands:', colors.bright)}
  ${colorize('list', colors.cyan)}           List all notes
  ${colorize('get <id>', colors.cyan)}       Get a specific note
  ${colorize('create', colors.cyan)}         Create a new note
  ${colorize('delete <id>', colors.cyan)}    Delete a note
  ${colorize('share <id>', colors.cyan)}     Share a note

${colorize('Examples:', colors.bright)}
  google-keep list
  google-keep list --limit 10
  google-keep get ABC123
  google-keep create --title "Shopping" --text "Buy milk"
  google-keep create --title "Todo" --list-item "Task 1" --list-item "Task 2"
  google-keep delete ABC123
  google-keep share ABC123 --email "friend@gmail.com"

${colorize('Setup:', colors.bright)}
  Run: gcloud auth application-default login
`);
    }
  } catch (error) {
    console.error(colorize(`\n❌ Error: ${error.message}`, colors.red));
    process.exit(1);
  }
}

main();
