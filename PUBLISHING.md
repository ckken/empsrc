# Publishing Guide

## Prerequisites

1. npm account: https://www.npmjs.com/signup
2. Login: `npm login`

## Publish Steps

### 1. Check package name availability

```bash
npm view @ckken/empsrc
```

If 404, the name is available.

### 2. Test locally

```bash
npm link
empsrc --version
empsrc add vercel/next.js --category frontend
```

### 3. Publish

```bash
# Dry run (check what will be published)
npm publish --dry-run

# Publish to npm
npm publish --access public
```

### 4. Verify

```bash
npm view @ckken/empsrc
```

## Version Updates

```bash
# Patch (0.1.0 -> 0.1.1)
npm version patch

# Minor (0.1.0 -> 0.2.0)
npm version minor

# Major (0.1.0 -> 1.0.0)
npm version major

# Then publish
npm publish
```

## GitHub Release

```bash
# Create GitHub repo
gh repo create empsrc --public --source=. --remote=origin

# Push code
git push -u origin main

# Create release
gh release create v0.1.0 --title "v0.1.0" --notes "Initial release"
```

## Post-publish

1. Update README badges
2. Add to clawhub.com (if applicable)
3. Share on Twitter/社区
