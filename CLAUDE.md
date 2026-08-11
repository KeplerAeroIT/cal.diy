# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Primary source of truth

**Read [AGENTS.md](./AGENTS.md) first.** It contains the full engineering guide (do's/don'ts, commands, tech stack, PR size limits, boundaries on what to do vs. ask first vs. never do). This file only adds a quick orientation layer on top of it — it intentionally does not repeat AGENTS.md's content.

Deeper, topic-specific guidance lives under `agents/`:
- [agents/commands.md](agents/commands.md) — full build/test/lint/db command reference
- [agents/knowledge-base.md](agents/knowledge-base.md) — domain knowledge (managed event types, orgs/teams, OAuth clients, calendar cache, workflows vs. webhooks, etc.)
- [agents/rules/](agents/rules/) — modular rules by topic (architecture, data layer, API, performance, testing, CI/CD, patterns); index at [agents/rules/README.md](agents/README.md)

`.cursor/rules` and `.cursor/skills` symlink into `agents/rules` and `agents/skills`, so these rules apply across Claude Code, Cursor, and other agent tools uniformly — edit them in `agents/`, not per-tool.

## What Cal.diy is

Cal.diy is the community-driven, MIT-licensed fork of Cal.com with all enterprise/commercial (EE) code removed — no Teams/Organizations/Insights/SSO, no license key, no open-core split. It's self-hosted only (no hosted version). Keep this in mind when porting logic from upstream Cal.com references: EE-gated code paths should not be reintroduced.

## Repository shape

Yarn workspaces + Turborepo monorepo:

```
apps/web/          Main Next.js application (primary app most work targets)
apps/api/           API v2 (NestJS) — see AGENTS.md "API v2 Imports" section for a
                     platform-libraries re-export gotcha specific to this app
apps/docs/          Documentation site
packages/prisma/    Database schema (schema.prisma) + migrations
packages/trpc/      tRPC API layer (routers in server/routers/)
packages/ui/        Shared UI components (import from subpaths, not the barrel)
packages/features/  Feature-specific vertical slices
packages/app-store/ Third-party/calendar integrations (some files are
                     app-store-cli generated — never hand-edit *.generated.ts)
packages/platform/  Platform SDK/libraries consumed by apps/api
packages/lib/       Shared utilities
packages/i18n/      Translations (packages/i18n/locales/en/common.json for new strings)
```

For anything not covered above — commands, coding conventions, error handling, import patterns, PR checklist — defer to AGENTS.md rather than assuming.
