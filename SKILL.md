# Google Keep

**在 OpenClaw 中使用 Google Keep 管理笔记。**

## 功能

- 📝 列出所有笔记
- ✨ 创建新笔记（支持纯文本和列表）
- 🔍 获取单个笔记详情
- 🗑️ 删除笔记
- 👥 管理笔记权限（共享）

## 使用场景

当用户说以下内容时激活此技能：

- "列出我的 Google Keep 笔记"
- "查看我的 Keep 笔记"
- "创建一个笔记"
- "在 Google Keep 中添加"
- "删除我的 Keep 笔记"
- "共享我的 Keep 笔记"
- "google keep" / "keep 笔记" / "Google Keep"

## 认证

此 skill 需要 Google OAuth 2.0 认证。请确保已在 `models.json` 或环境变量中配置 Google 认证。

**所需 OAuth 范围：**
- `https://www.googleapis.com/auth/keep` - 完整读写权限
- `https://www.googleapis.com/auth/keep.readonly` - 只读权限

## 使用方法

### 列出笔记

```bash
# 列出所有笔记
google-keep list

# 列出最近10条
google-keep list --limit 10

# 过滤条件（更新时间）
google-keep list --filter "update_time > '2024-01-01T00:00:00Z'"

# 只显示未删除的笔记
google-keep list --filter "trashed=false"
```

### 获取笔记详情

```bash
google-keep get <note-id>
```

### 创建笔记

```bash
# 创建纯文本笔记
google-keep create --title "我的笔记标题" --text "这是笔记内容"

# 创建列表笔记
google-keep create --title "购物清单" --list-item "牛奶" --list-item "面包" --list-item "鸡蛋"
```

### 删除笔记

```bash
google-keep delete <note-id>
```

### 共享笔记

```bash
# 添加协作者（写入权限）
google-keep share <note-id> --email "friend@gmail.com" --role writer

# 批量共享
google-keep share <note-id> --emails "a@gmail.com,b@gmail.com" --role writer
```

## 配置

在 `TOOLS.md` 中记录你的配置：

```markdown
### Google Keep

- 默认笔记限制: 20
- OAuth 范围: keep, keep.readonly
- API 基础 URL: https://keep.googleapis.com/
```

## 技术细节

- **API 版本**: v1
- **基础 URL**: https://keep.googleapis.com/
- **认证**: OAuth 2.0
- **主要资源**: notes, permissions

## 注意事项

- 笔记标题不能超过 1000 字符
- 笔记正文不能超过 20,000 字符
- 列表项不能超过 1,000 项
- 支持一级嵌套列表
- 权限只能设置为 WRITER（不能转移 OWNER）
