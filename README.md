# empsrc

[![npm version](https://badge.fury.io/js/%40ckken%2Fempsrc.svg)](https://www.npmjs.com/package/@ckken/empsrc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

GitHub reference project manager for AI coding agents.

![Demo](./demo.jpg)

## 🎯 What is this?

`empsrc` helps you manage reference projects for AI coding agents. Instead of manually cloning repos, it automates:

- ✅ Clone GitHub repos to `refs/` directory
- ✅ Organize by category (frontend/backend/ai/tools)
- ✅ Track versions in `refs/sources.json`
- ✅ Auto-update `AGENTS.md` with project references
- ✅ Auto-add `refs/` to `.gitignore`

Inspired by [opensrc](https://github.com/vercel/opensrc) but for GitHub reference projects instead of npm packages.

## 📦 Installation

```bash
npm install -g @ckken/empsrc
```

## 🚀 Quick Start

```bash
# Add a reference project
empsrc add vercel/next.js --category frontend

# List all projects
empsrc list

# Update all projects
empsrc update

# Remove a project
empsrc remove next.js
```

## 📖 Commands

### `empsrc add <repo>`

Add a GitHub repository as reference.

```bash
# Basic usage
empsrc add vercel/next.js

# With category
empsrc add vercel/next.js --category frontend

# With specific branch
empsrc add vercel/next.js --category frontend --branch canary

# Support github: prefix
empsrc add github:vercel/next.js
```

**Options:**
- `-c, --category <category>` - Category (frontend/backend/ai/tools), default: tools
- `-b, --branch <branch>` - Branch or tag to checkout

### `empsrc list`

List all reference projects.

```bash
# List all
empsrc list

# Filter by category
empsrc list --category frontend
```

**Options:**
- `-c, --category <category>` - Filter by category

### `empsrc update [name]`

Update projects to latest commit.

```bash
# Update all
empsrc update

# Update specific project
empsrc update next.js
```

### `empsrc remove <name>`

Remove a reference project (with confirmation).

```bash
empsrc remove next.js
```

## 📁 Directory Structure

After running `empsrc add`, your project will look like:

```
your-project/
├── refs/
│   ├── frontend/
│   │   └── next.js/          # Cloned repo
│   ├── backend/
│   │   └── fastify/
│   ├── ai/
│   │   └── langchain/
│   ├── tools/
│   │   └── vitest/
│   └── sources.json          # Project metadata
├── AGENTS.md                  # Auto-updated
└── .gitignore                 # Auto-updated
```

## 📝 sources.json Format

`empsrc` tracks all projects in `refs/sources.json`:

```json
{
  "projects": [
    {
      "name": "next.js",
      "repo": "vercel/next.js",
      "category": "frontend",
      "commit": "9b6e563",
      "branch": "main",
      "description": "The React Framework",
      "added": "2026-02-23"
    }
  ]
}
```

## 🤖 AGENTS.md Integration

`empsrc` automatically updates your `AGENTS.md` with a reference section:

```markdown
## Reference Projects (refs/)

AI Agent can reference these projects for implementation details:

### Frontend
- **next.js** (`refs/frontend/next.js/`) - vercel/next.js
  The React Framework

### Backend
- **fastify** (`refs/backend/fastify/`) - fastify/fastify
  Fast and low overhead web framework
```

This helps AI coding agents (like Claude, Cursor, Copilot) understand where to find reference implementations.

## 🔧 Categories

- `frontend` - React, Vue, Next.js, Nuxt, etc.
- `backend` - Express, Fastify, NestJS, Django, etc.
- `ai` - LangChain, LlamaIndex, Transformers, etc.
- `tools` - Build tools, testing frameworks, CLI tools, etc.

## 🎯 Use Cases

### For AI Coding Agents

```bash
# Add reference projects for your stack
empsrc add vercel/next.js --category frontend
empsrc add fastify/fastify --category backend
empsrc add langchain-ai/langchainjs --category ai

# AI agents can now reference these implementations
```

### For Learning & Reference

```bash
# Study how popular projects are structured
empsrc add shadcn-ui/ui --category frontend
empsrc add trpc/trpc --category backend
```

### For Team Onboarding

```bash
# Share reference projects with your team
empsrc add your-org/design-system --category frontend
empsrc add your-org/api-gateway --category backend
```

## 🆚 vs opensrc

| Feature | empsrc | opensrc |
|---------|--------|---------|
| Target | GitHub repos | npm packages |
| Use case | Reference projects | Dependency source code |
| Auto-detect | Manual add | Auto from lockfile |
| Categories | frontend/backend/ai/tools | npm/pypi/crates |
| Update | `empsrc update` | Re-run opensrc |

## 🛠️ Development

```bash
# Clone repo
git clone https://github.com/ckken/empsrc.git
cd empsrc

# Install dependencies
npm install

# Link for local testing
npm link

# Test
empsrc add vercel/next.js
```

## 📄 License

MIT © Ken

## 🙏 Credits

Inspired by [opensrc](https://github.com/vercel/opensrc) by Vercel.

## 🔗 Links

- [GitHub](https://github.com/ckken/empsrc)
- [npm](https://www.npmjs.com/package/@ckken/empsrc)
- [Issues](https://github.com/ckken/empsrc/issues)
