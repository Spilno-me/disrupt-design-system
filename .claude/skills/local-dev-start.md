# Start Local Development



**Category:** delivery | **Tags:** local, development, yalc, npm-pack, testing
**Variables:** `{APP_PATH}`, `{METHOD}`

---

Set up local DDS development for testing in consumer app at {APP_PATH}.

READ FIRST: `src/stories/developers/LocalDevelopment.mdx`

## Method: {METHOD}

### Option A: yalc (Best for Active Development - Hot Reload)

```bash
# One-time setup (if not installed)
npm install -g yalc

# Step 1: Build and publish DDS to local store
cd ~/Desktop/DDS
npm run build
yalc publish

# Step 2: Link in your app (first time only)
cd {APP_PATH}
yalc add @adrozdenko/design-system

# Step 3: Start development
# Terminal 1 (DDS): Watch and auto-push
cd ~/Desktop/DDS
npm run build && yalc push --watch

# Terminal 2 (Your app): Dev server
cd {APP_PATH}
npm run dev
```

**After each DDS change:**
```bash
cd ~/Desktop/DDS
npm run build && yalc push
```

### Option B: npm pack (Best for Final Verification)

```bash
# Step 1: Build DDS
cd ~/Desktop/DDS
npm run build

# Step 2: Create package tarball
npm pack
# Creates: adrozdenko-design-system-X.X.X.tgz

# Step 3: Install in your app
cd {APP_PATH}
npm install ~/Desktop/DDS/adrozdenko-design-system-*.tgz

# Step 4: Start app
npm run dev
```

**One-liner for updates:**
```bash
cd ~/Desktop/DDS && npm run build && npm pack && cd {APP_PATH} && npm install ~/Desktop/DDS/*.tgz
```

## Verification Checklist
- [ ] DDS components render correctly
- [ ] Styles/tokens applied properly
- [ ] No "Multiple React instances" error
- [ ] TypeScript types resolve

## Troubleshooting
| Issue | Solution |
|-------|----------|
| "Invalid hook call" | Use yalc, not npm link |
| Changes not reflecting | Clear node_modules/.cache, restart dev server |
| TypeScript errors | Run `npm run build` in DDS first |
| Styles missing | Import `@adrozdenko/design-system/styles` |

OUTPUT: Local development environment ready with DDS linked.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
