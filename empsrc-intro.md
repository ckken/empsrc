# empsrc - GitHub 参考项目管理工具

## 一句话介绍

一个专为 AI Coding Agent 设计的 CLI 工具，自动化管理 GitHub 参考项目，让 AI 能轻松访问完整源码而非只看文档。

## 核心问题

当 AI Agent 写代码时，它只能看到：
- ❌ npm 包的类型定义（.d.ts）
- ❌ 在线文档（可能过时）
- ❌ 零散的代码片段

但它看不到：
- ✅ 完整的实现细节
- ✅ 最佳实践和架构设计
- ✅ 真实项目的代码组织

## 解决方案

`empsrc` 自动化管理参考项目：

```bash
# 一键添加参考项目
empsrc add vercel/next.js --category frontend

# 自动完成：
# 1. Clone 到 refs/frontend/next.js/
# 2. 记录版本到 refs/sources.json
# 3. 更新 AGENTS.md 告知 AI
# 4. 添加到 .gitignore
```

## 核心功能

### 1. 自动化添加
```bash
empsrc add vercel/next.js --category frontend
empsrc add fastify/fastify --category backend
empsrc add langchain-ai/langchainjs --category ai
```

### 2. 智能分类
- `frontend` - React, Vue, Next.js, Nuxt
- `backend` - Express, Fastify, NestJS, Django
- `ai` - LangChain, LlamaIndex, Transformers
- `tools` - Build tools, testing frameworks

### 3. 版本管理
```bash
# 更新所有项目
empsrc update

# 更新特定项目
empsrc update next.js
```

### 4. 项目索引
自动维护 `refs/sources.json`：
```json
{
  "projects": [
    {
      "name": "next.js",
      "repo": "vercel/next.js",
      "category": "frontend",
      "commit": "9b6e563",
      "branch": "main",
      "added": "2026-02-23"
    }
  ]
}
```

### 5. AI Agent 集成
自动更新 `AGENTS.md`：
```markdown
## Reference Projects (refs/)

### Frontend
- **next.js** (`refs/frontend/next.js/`) - vercel/next.js
  The React Framework
```

## 使用场景

### 场景 1: AI Agent 开发
```bash
# 让 AI 参考 Next.js 的实现
empsrc add vercel/next.js --category frontend

# AI 现在可以：
# - 查看 Next.js 的路由实现
# - 学习 SSR 的最佳实践
# - 参考构建优化方案
```

### 场景 2: 学习和研究
```bash
# 研究流行项目的架构
empsrc add shadcn-ui/ui --category frontend
empsrc add trpc/trpc --category backend

# 随时查看源码，理解设计思路
```

### 场景 3: 团队协作
```bash
# 统一团队参考标准
empsrc add your-org/design-system --category frontend
empsrc add your-org/api-gateway --category backend

# 新人快速上手，参考内部最佳实践
```

## 技术实现

### 架构
```
empsrc/
├── bin/empsrc.js          # CLI 入口
├── src/
│   ├── config.js          # 配置管理
│   └── commands/
│       ├── add.js         # 添加项目
│       ├── list.js        # 列出项目
│       ├── update.js      # 更新项目
│       └── remove.js      # 删除项目
```

### 技术栈
- Node.js + Commander.js (CLI 框架)
- simple-git (Git 操作)
- chalk + ora (美化输出)
- inquirer (交互式确认)

### 核心流程
1. 解析 GitHub repo (支持 `owner/repo` 或 `github:owner/repo`)
2. Clone 到 `refs/<category>/<name>/`
3. 记录元信息到 `refs/sources.json`
4. 更新 `AGENTS.md` 添加引用
5. 更新 `.gitignore` 排除 `refs/`

## 对比 opensrc

| 维度 | empsrc | opensrc (Vercel) |
|------|--------|------------------|
| 目标 | GitHub 参考项目 | npm 依赖包源码 |
| 用例 | 学习架构和最佳实践 | 理解依赖实现细节 |
| 自动化 | 手动添加 | 自动检测 lockfile |
| 分类 | 技术栈分类 | registry 分类 |
| 适用 | 任何 GitHub 项目 | npm/PyPI/crates 包 |

## 创新点

1. **技术栈分类** - 按 frontend/backend/ai/tools 分类，比 registry 分类更直观
2. **手动精选** - 不是自动拉取所有依赖，而是精选参考项目
3. **AI Agent 优先** - 专为 AI Coding Agent 设计，自动更新 AGENTS.md
4. **轻量级** - 只 clone 需要的项目，不会像 opensrc 那样拉取所有依赖

## 安装使用

```bash
# 安装
npm install -g @ckken/empsrc

# 使用
empsrc add vercel/next.js --category frontend
empsrc list
empsrc update
empsrc remove next.js
```

## 项目状态

- ✅ 核心功能完成
- ✅ 本地测试通过
- ✅ 文档完善
- ⏳ 待发布到 npm
- ⏳ 待创建 GitHub 仓库

## 未来计划

1. **自动推荐** - 根据项目依赖推荐相关参考项目
2. **版本锁定** - 支持锁定特定 commit/tag
3. **搜索功能** - 在参考项目中搜索代码片段
4. **统计分析** - 分析参考项目的使用频率
5. **OpenClaw Skill** - 集成到 OpenClaw 生态

## 总结

`empsrc` 是一个简单但实用的工具，解决了 AI Coding Agent 缺少完整源码参考的痛点。通过自动化管理 GitHub 参考项目，让 AI 能像人类开发者一样，参考优秀项目的实现细节和最佳实践。

**核心价值：让 AI 不只是看文档，而是看真实的代码。**
