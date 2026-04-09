# Slow startup – findings and workarounds

## What we know

- **`nest start --watch`** and **`nest build`** hang or take 5+ minutes (Nest CLI / TypeScript build).
- **`npm run dev`** (tsx) and **`node scripts/check-imports.mjs`** both hang as soon as Node tries to load **`@nestjs/core`**.
- So the blocker is **Node loading `@nestjs/core`** in this environment, not the build tool.

## Try these (in order)

### 1. Confirm where it hangs

```bash
npm run check-imports
```

You should see `1: start` then it stops. If it never gets to `2: @nestjs/core`, Node is stuck loading that package.

### 2. Clean reinstall

```bash
rm -rf node_modules package-lock.json
npm install --include=optional
npm run check-imports
```

If it still hangs at the same place, the issue is likely the machine or environment.

### 3. Run from a fast local disk

Copy the project to a local folder (e.g. `cp -r . /tmp/api-gateway && cd /tmp/api-gateway`) and run:

```bash
npm run check-imports
```

If it finishes quickly there, the original project folder may be on a slow or network drive, or under heavy antivirus/scanning.

### 4. Antivirus / security

Temporarily exclude the project directory (or at least `node_modules`) from real-time scanning and try again.

### 5. Use a pre-built `dist/` (if you can build elsewhere)

If you can run `npm run build` on another machine or in CI:

- Copy the generated `dist/` folder into this project.
- Run: `node dist/main.js`

No Nest CLI or tsx involved; startup should be normal.

### 6. Docker (optional)

Run the app in a container so the environment is consistent and often faster:

```bash
docker build -t api-gateway .
docker run -p 3000:3000 --env-file .env api-gateway
```

You’d need a `Dockerfile` that runs `npm run build` and `node dist/main.js`.

---

**Summary:** The slowdown is from **loading `@nestjs/core`** in Node in this environment. Fix the environment (disk, antivirus, clean install) or run the app from a pre-built `dist/` or Docker.
