# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start development mode with hot reload
yarn build        # Full build (runs typecheck first)
yarn lint         # ESLint with cache
yarn format       # Prettier formatter
yarn typecheck    # Run both node and web typechecks
yarn typecheck:node  # TypeScript check for Electron/main process
yarn typecheck:web   # TypeScript check for React/renderer
```

Platform builds: `yarn build:mac`, `yarn build:win`, `yarn build:linux`

## Architecture

This is an Electron + React desktop app for managing content on static websites (blogs, galleries, products). The stack is Electron 39, React 19, Chakra UI 3, React Hook Form, React Router DOM 7, and MDXEditor.

### Process Separation

**Main process** (`src/main/`) handles all file I/O and system operations. The entry point `src/main/index.ts` registers 50+ IPC handlers and imports 13 domain routers from `src/main/modules/` (blogRouter, galleryRouter, imagesRouter, productsRouter, etc.). Each router handles read/write operations for its feature domain by manipulating JSON files on disk at the user-configured site path.

**Renderer process** (`src/renderer/src/`) is a standard React SPA. IPC calls to the main process are the only way to read/write data. The preload script exposes these as `window.api.*` methods.

**Shared** (`src/shared/`) contains TypeScript type definitions (`types.d.ts`) and constants (`constants.ts`) used by both processes.

### Routing

Uses `electron-router-dom` (custom package wrapping React Router for Electron). Routes are defined in `src/renderer/src/components/SiteRoutes.tsx`. All routes render inside `SiteLayout` which provides the sidebar + content area shell. Individual pages live in `src/renderer/src/pages/`.

### Feature Gating

The app is feature-gated based on the site's `SiteInfo.features` array (type `Feature[]`). The Sidebar and pages conditionally render sections based on which features are enabled (blog, content, galleries, products, categories, subjects, sale). The Sidebar loads this via IPC on mount.

### Layout Structure

- `SiteLayout` — outer shell with collapsible sidebar using Chakra Splitter. Sidebar auto-collapses when width < 170px.
- `PageLayout` — inner card container used by all pages; provides title, optional action button, scrollable body, and a success/info dialog.

### Forms & Editors

Forms live in `src/renderer/src/forms/`. They use React Hook Form for state management. Rich text editing uses MDXEditor. Image handling uses Jimp for processing. Custom inputs are in `src/renderer/src/components/inputs/`.

### Path Alias

`@renderer/*` resolves to `src/renderer/src/*` (configured in `tsconfig.web.json` and `electron.vite.config.ts`).

### Styling

Chakra UI 3 with custom theme recipes in `src/renderer/src/themeRecipes/`. Dark/light mode via `next-themes`. Icons from Phosphor Icons and React Icons.
