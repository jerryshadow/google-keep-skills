# Google Keep Skill for OpenClaw

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/jerryshadow/google-keep-skills?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/jerryshadow/google-keep-skills?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/jerryshadow/google-keep-skills?style=flat-square)
![License](https://img.shields.io/github/license/jerryshadow/google-keep-skills?style=flat-square)

**在 OpenClaw 中管理你的 Google Keep 笔记**

[English](./README.md) | [中文](./README_CN.md)

</div>

---

## 📋 目录

- [✨ 特性](#-特性)
- [🚀 快速开始](#-快速开始)
- [🔧 安装](#-安装)
- [📖 使用方法](#-使用方法)
- [⚙️ 配置](#️-配置)
- [🤝 贡献](#-贡献)
- [📄 许可证](#-许可证)

---

## ✨ 特性

- 📝 **列出笔记** - 查看所有 Google Keep 笔记
- ✨ **创建笔记** - 支持纯文本和清单格式
- 🔍 **查看笔记** - 获取单个笔记的完整详情
- 🗑️ **删除笔记** - 移动到回收站或永久删除
- 👥 **共享笔记** - 与他人协作管理笔记
- 🔐 **安全认证** - 使用 Google OAuth 2.0

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- Google Cloud 账号
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

### 1. 启用 Google Keep API

```bash
# 访问 Google Cloud Console
# https://console.cloud.google.com/apis/library/keep.googleapis.com

# 或使用 gcloud 命令启用
gcloud services enable keep.googleapis.com
```

### 2. 设置认证

```bash
# 登录 Google 账号（浏览器会打开）
gcloud auth application-default login

# 验证登录
gcloud auth list
```

### 3. 克隆并安装

```bash
# 克隆仓库
git clone https://github.com/jerryshadow/google-keep-skills.git
cd google-keep-skills

# 安装依赖
npm install
```

### 4. 开始使用

```bash
# 列出所有笔记
node index.cjs list

# 创建新笔记
node index.cjs create --title "购物清单" --text "牛奶、面包、鸡蛋"

# 查看笔记详情
node index.cjs get <note-id>

# 删除笔记
node index.cjs delete <note-id>
```

---

## 📖 使用方法

### 列出笔记

```bash
# 列出所有笔记（默认20条）
node index.cjs list

# 限制数量
node index.cjs list --limit 10

# 按更新时间过滤
node index.cjs list --filter "update_time > '2024-01-01T00:00:00Z'"

# 只显示未删除的笔记
node index.cjs list --filter "trashed=false"
```

### 获取笔记详情

```bash
# 获取单个笔记
node index.cjs get <note-id>
```

### 创建笔记

```bash
# 创建纯文本笔记
node index.cjs create --title "会议记录" --text "讨论项目进度和下一步计划"

# 创建清单笔记
node index.cjs create --title "待办事项" \
  --list-item "完成报告" \
  --list-item "发送邮件" \
  --list-item "安排会议"

# 创建带子项的清单
node index.cjs create --title "项目计划" \
  --list-item "前端开发" \
  --list-item "后端开发" \
  --list-item "测试部署"
```

### 删除笔记

```bash
# 删除笔记（移到回收站）
node index.cjs delete <note-id>

# 强制删除（跳过确认）
node index.cjs delete <note-id> --force
```

### 共享笔记

```bash
# 共享给单个用户（写入权限）
node index.cjs share <note-id> --email "friend@gmail.com"

# 共享给多个用户
node index.cjs share <note-id> --emails "a@gmail.com,b@gmail.com"

# 指定权限角色
node index.cjs share <note-id> --email "colleague@gmail.com" --role writer
```

---

## ⚙️ 配置

### 环境变量

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `GOOGLE_ACCESS_TOKEN` | Google 访问令牌 | - |
| `GOOGLE_REFRESH_TOKEN` | Google 刷新令牌 | - |

### OpenClaw 集成

将 skill 复制到 OpenClaw 工作区：

```bash
cp -r google-keep-skills ~/.openclaw/skills/
```

然后在 OpenClaw 中直接使用自然语言：

```
"列出我的 Google Keep 笔记"
"创建一个购物清单"
"删除笔记 ABC123"
```

---

## 🤝 贡献

欢迎贡献！请阅读我们的贡献指南了解如何参与项目。

### 如何贡献

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件。

---

## 🙏 致谢

- [OpenClaw](https://openclaw.ai/) - 你的私人 AI 助理
- [Google Keep API](https://developers.google.com/workspace/keep/api) - Google Keep API 文档

---

<div align="center">

**如果这个项目对你有帮助，请给我们一个 ⭐ Star！**

</div>
