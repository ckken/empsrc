# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2026-02-23

### Added
- **TypeScript Rewrite** - Full type safety with TypeScript
- **Bun Runtime** - Faster execution with Bun
- **Search Command** - `empsrc search <keyword>` to search across projects
- **Stats Command** - `empsrc stats` to view project statistics
- **Init Command** - `empsrc init` to initialize project setup
- **Comprehensive Tests** - 14+ test cases with Bun Test
- **Better Error Handling** - Improved error messages and validation

### Changed
- Migrated from JavaScript to TypeScript
- Switched from Node.js to Bun runtime
- Updated dependencies to latest versions
- Improved CLI output with better formatting

### Technical
- Added type definitions for all commands
- Implemented Bun's native test runner
- Added helper utilities for common operations
- Improved code organization and modularity

## [0.1.0] - 2026-02-23

### Added
- Initial release
- `empsrc add` - Add GitHub repos as reference projects
- `empsrc list` - List all projects with filtering
- `empsrc update` - Update projects to latest commit
- `empsrc remove` - Remove projects with confirmation
- Auto-update `refs/sources.json`
- Auto-update `AGENTS.md` with reference section
- Auto-update `.gitignore` to exclude `refs/`
- Support for categories: frontend/backend/ai/tools
- Support for branch/tag checkout
- Colored CLI output with ora spinners
