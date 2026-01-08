# End Local Development



**Category:** delivery | **Tags:** local, development, cleanup, yalc, restore
**Variables:** `{APP_PATH}`

---

Clean up local DDS development and restore npm version in {APP_PATH}.

READ FIRST: `src/stories/developers/LocalDevelopment.mdx`

## Cleanup Steps

### If using yalc:

```bash
# Step 1: Remove yalc link
cd {APP_PATH}
yalc remove @adrozdenko/design-system

# Step 2: Restore npm version
npm install

# Step 3: Verify package.json has no yalc references
cat package.json | grep -E "yalc|file:"
# Should return empty

# Step 4: Clean yalc store (optional)
yalc installations clean
```

### If using npm pack / file path:

```bash
# Step 1: Update package.json to npm version
cd {APP_PATH}
npm uninstall @adrozdenko/design-system
npm install @adrozdenko/design-system@latest

# Step 2: Verify package.json
cat package.json | grep "@adrozdenko/design-system"
# Should show npm version like "^2.7.0"

# Step 3: Remove tarball files from DDS
cd ~/Desktop/DDS
rm -f *.tgz
```

## Pre-Commit Checklist
- [ ] No `file:` references in package.json
- [ ] No `.yalc` folder in app root
- [ ] No `yalc.lock` file in app root
- [ ] package-lock.json shows npm registry URL
- [ ] App builds successfully with npm version

## Verification

```bash
# Verify clean package.json
cd {APP_PATH}
grep -E "yalc|file:" package.json
# Should return nothing

# Verify npm version works
rm -rf node_modules
npm install
npm run build
```

## Common Issues
| Issue | Solution |
|-------|----------|
| yalc folder still exists | `rm -rf .yalc yalc.lock` |
| Old tarball path in lockfile | Delete package-lock.json, run `npm install` |
| Version mismatch | Specify exact version: `npm install @adrozdenko/design-system@2.7.0` |

## FORBIDDEN
- Committing with `file:` or yalc references in package.json
- Leaving .yalc folder in repository
- Pushing tarball files to git

OUTPUT: Clean package.json with npm registry version, ready to commit.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
