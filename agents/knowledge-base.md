# Knowledge Base - Domain & Product-Specific Information

This file contains domain knowledge about the Cal.diy product and codebase. For coding guidelines and rules, see [`rules/`](rules/).

## When working with managed event types

When a managed event type is created, we create:
- A **parent managed event type** for the team (has `teamId` set in EventType table)
- A **child managed event type** for each assigned user (has `userId` set in EventType table)

Example: If we create a managed event type and assign Alice and Bob, three rows will be inserted in the EventType table (1 parent + 2 children).

**Important**: Only child managed event types can be booked.

## When working with organizations and teams

Both organizations and teams are stored in the `Team` table:
- **Organizations**: Have `isOrganization` set to `true`
- **Teams within an organization**: Have `parentId` set (pointing to the organization)

## When working with OAuth clients

There are two types of OAuth clients:

| Type | Table | Purpose |
|------|-------|---------|
| OAuth client | `OAuthClient` | Allows 3rd party apps to connect users' cal.com accounts |
| Platform OAuth client | `PlatformOAuthClient` | Used by platform customers integrating cal.com scheduling directly in their platforms |

If someone says "platform OAuth client" they mean the one in the `PlatformOAuthClient` table.

## When you need product or codebase context

### Monorepo Structure

The whole repository is a monorepo. The main web app is in `apps/web` folder.

### Local Development Database

When setting up local development database, it creates test users. The passwords are the same as the username:
- `free:free`
- `pro:pro`

### Logging Levels

Control logging verbosity by setting `NEXT_PUBLIC_LOGGER_LEVEL` in .env:
- 0: silly
- 1: trace
- 2: debug
- 3: info
- 4: warn
- 5: error
- 6: fatal

### Cal.diy Event Identification

Cal.diy events in Google Calendar can be identified by checking if the iCalUID ends with `@Cal.diy` (e.g., `2GBXSdEixretciJfKVmYN8@Cal.diy`). This identifier is used to distinguish Cal.diy bookings from other calendar events for data storage and privacy purposes.

### UI Component Locations

- Event types page: `apps/web/modules/event-types/views/event-types-listing-view.tsx`
- Bookings page: `apps/web/modules/bookings/views/bookings-view.tsx`
- Shared elements (tabs, search bars, filter buttons) should maintain consistent alignment across views

### DataTable

Refer to the DataTable guide at `packages/features/data-table/GUIDE.md` for implementation patterns and best practices.

### Round-Robin Scheduling

Reuse existing code in `packages/features/bookings/lib/getLuckyUser.ts` which handles:
- Weight-based selection
- Priority ranking
- Round-robin fairness algorithms

Check if existing functions can be extended before creating new implementations.

### Calendar Cache System

The calendar cache system follows specific patterns in `packages/features/calendar-cache-sql`. When implementing provider-specific calendar cache services (like for Outlook/Office365), place the provider-specific code in the corresponding provider directory (e.g., `packages/app-store/office365calendar`).

### API Documentation

The OpenAPI specification at `docs/api-reference/v2/openapi.json` is auto-generated from NestJS controllers. Manual edits will be wiped out.

To make persistent changes to API documentation, use NestJS decorators (`@ApiQuery`, `@ApiOperation`, etc.) in the controller files at `apps/api/v2/src/modules/*/controllers/*.controller.ts`.

### Workflows vs Webhooks

Workflows (automated reminders) were fully removed from this fork — the Prisma schema has no `Workflow` model, and migration `20260319000000_drop_workflow_tables` dropped the tables. `packages/features/ee/workflows/` does not exist. Webhooks (`packages/features/webhooks/`) are a separate, still-present system — do not confuse the two or assume workflow code exists.

### Login providers (NextAuth)

Providers are wired up in `packages/features/auth/lib/next-auth-options.ts`: CAL credentials (email+password), email magic link, and optionally Google, Azure AD/Outlook, and generic OIDC (Authentik, Keycloak, etc. — config in `packages/features/auth/lib/oidc.ts`, enabled via `OIDC_LOGIN_ENABLED`). `SAML`/`saml-idp` handling in the sign-in callback is vestigial from upstream Cal.com — `packages/features/ee` doesn't exist in this fork, so SAML login isn't actually functional despite the `IdentityProvider.SAML` enum value and stale `.env.example` docs referencing it.

New users are auto-provisioned on first OAuth/OIDC login (same as Google/Azure AD always did) — this bypasses `NEXT_PUBLIC_DISABLE_SIGNUP` entirely, since that flag only gates the credentials-based `/api/auth/signup` route. Access control for OAuth/OIDC sign-in must be enforced on the IdP side.

**Turborepo env var gotcha**: any custom env var (like the `OIDC_*` ones) must be added to `globalEnv` in `turbo.json`, or Turborepo silently strips it before it reaches the actual `next start` process — the var will still show up via `docker exec <container> env` (which reflects the container's env, not what Turbo passes through to the task), making this easy to misdiagnose as a Docker/env_file problem when it's actually a Turbo allowlist problem.
