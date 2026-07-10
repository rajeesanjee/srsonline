<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# srsonline AI agent guidance

- This repo is a frontend-only Next.js app using React 19, Next.js 16, TypeScript, Tailwind CSS v4, `@tailwindcss/postcss`, `@base-ui/react`, `shadcn`, `class-variance-authority`, and `clsx`.
- Project commands:
  - `npm install`
  - `npm run dev`
  - `npm run build`
  - `npm run start`
  - `npm run lint`
- Key source locations:
  - `app/` — app router entrypoints, layouts, and pages
  - `app/components/` — reusable page sections and shared layout pieces
  - `src/lib/` — site metadata and shared utility functions
  - `src/components/ui/` — primitive UI components used across the app
- UI and styling conventions:
  - Keep app router conventions; do not assume `pages/` router behavior.
  - Prefer Tailwind utility classes and shared UI components over custom CSS.
  - Preserve the existing component hierarchy in `app/components/*`.
- This repo has no backend API routes; focus changes on frontend routes, components, and styling.
- For generic Next.js setup details, link to `README.md` rather than duplicating the same content.
- `CLAUDE.md` is an alias to this file and should follow the same guidance.
