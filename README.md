# Google Keep Skill for OpenClaw

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/jerryshadow/google-keep-skills?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/jerryshadow/google-keep-skills?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/jerryshadow/google-keep-skills?style=flat-square)
![License](https://img.shields.io/github/license/jerryshadow/google-keep-skills?style=flat-square)

**Manage your Google Keep notes in OpenClaw**

[English](./README.md) | [中文](./README_CN.md)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🔧 Installation](#-installation)
- [📖 Usage](#-usage)
- [⚙️ Configuration](#️-configuration)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

- 📝 **List Notes** - View all your Google Keep notes
- ✨ **Create Notes** - Support plain text and checklist formats
- 🔍 **View Notes** - Get full details of a single note
- 🗑️ **Delete Notes** - Move to trash or permanently delete
- 👥 **Share Notes** - Collaborate with others
- 🔐 **Secure Auth** - Using Google OAuth 2.0

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Google Cloud account
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

### 1. Enable Google Keep API

```bash
# Visit Google Cloud Console
# https://console.cloud.google.com/apis/library/keep.googleapis.com

# Or use gcloud command
gcloud services enable keep.googleapis.com
```

### 2. Set Up Authentication

```bash
# Login to Google account (browser will open)
gcloud auth application-default login

# Verify login
gcloud auth list
```

### 3. Clone and Install

```bash
# Clone the repository
git clone https://github.com/jerryshadow/google-keep-skills.git
cd google-keep-skills

# Install dependencies
npm install
```

### 4. Start Using

```bash
# List all notes
node index.cjs list

# Create a new note
node index.cjs create --title "Shopping List" --text "Milk, Bread, Eggs"

# View note details
node index.cjs get <note-id>

# Delete a note
node index.cjs delete <note-id>
```

---

## 📖 Usage

### List Notes

```bash
# List all notes (default 20)
node index.cjs list

# Limit results
node index.cjs list --limit 10

# Filter by update time
node index.cjs list --filter "update_time > '2024-01-01T00:00:00Z'"

# Show only untrashed notes
node index.cjs list --filter "trashed=false"
```

### Get Note Details

```bash
# Get a single note
node index.cjs get <note-id>
```

### Create Notes

```bash
# Create a plain text note
node index.cjs create --title "Meeting Notes" --text "Discuss project progress and next steps"

# Create a checklist note
node index.cjs create --title "Todo List" \
  --list-item "Complete report" \
  --list-item "Send email" \
  --list-item "Schedule meeting"

# Create a checklist with sub-items
node index.cjs create --title "Project Plan" \
  --list-item "Frontend development" \
  --list-item "Backend development" \
  --list-item "Testing & deployment"
```

### Delete Notes

```bash
# Delete note (move to trash)
node index.cjs delete <note-id>

# Force delete (skip confirmation)
node index.cjs delete <note-id> --force
```

### Share Notes

```bash
# Share with single user (writer permission)
node index.cjs share <note-id> --email "friend@gmail.com"

# Share with multiple users
node index.cjs share <note-id> --emails "a@gmail.com,b@gmail.com"

# Specify role
node index.cjs share <note-id> --email "colleague@gmail.com" --role writer
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_ACCESS_TOKEN` | Google access token | - |
| `GOOGLE_REFRESH_TOKEN` | Google refresh token | - |

### OpenClaw Integration

Copy the skill to your OpenClaw workspace:

```bash
cp -r google-keep-skills ~/.openclaw/skills/
```

Then use natural language in OpenClaw:

```
"List my Google Keep notes"
"Create a shopping list"
"Delete note ABC123"
```

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guide for details.

### How to Contribute

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenClaw](https://openclaw.ai/) - Your personal AI assistant
- [Google Keep API](https://developers.google.com/workspace/keep/api) - Google Keep API documentation

---

<div align="center">

**If this project helped you, please give us a ⭐ Star!**

</div>
