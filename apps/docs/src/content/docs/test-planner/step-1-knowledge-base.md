---
title: "Step 1: Generate Knowledge Base"
description: "Analyze your codebase to produce AUTONOMA.md - a user-perspective guide that all subsequent steps depend on."
---

The knowledge base generator analyzes your frontend codebase and produces a user-perspective guide to every page, flow, and interaction in your application. It writes as if explaining the app to someone who can only see and interact with the UI - no technical details, no code references. This guide becomes the shared context that Steps 2, 3, and 4 all depend on.

## Prerequisites

- Your frontend codebase open in Claude Code. No prior steps needed - this is where it all starts.

## What this produces

- `autonoma/AUTONOMA.md` - the main knowledge base: what the app is, who uses it, how to navigate, detailed core flows, and all UI patterns
- `autonoma/skills/*.md` - one file per page or setup action, with step-by-step navigation instructions the test runner will follow

## Review checkpoint

After the agent finishes, it will present the **core flows** it identified and ask you to confirm them. This is the most important review in the entire plugin.

Core flows are the 2-4 workflows that represent the primary reason users use your product. They control how the test budget is distributed in Step 3: **core flows receive 50-60% of all generated tests**. If the agent identifies the wrong things as "core," your test suite will be heavily weighted toward less critical functionality.

Review the list carefully. For each identified core flow, ask yourself:

- "If this flow broke silently, would users immediately notice and stop using the product?"
- "Is there a more important workflow the agent missed?"

Only the core flow identification matters at this stage. The rest of AUTONOMA.md - navigation structure, UI patterns, skills - can be refined later without affecting test coverage distribution.

:::tip
Don't worry about perfecting the knowledge base in one pass. The core flows are what matter most right now. You can always edit AUTONOMA.md later to fix navigation descriptions or add missing skills.
:::

## The prompt

<details>
<summary>Expand full prompt</summary>

# AUTONOMA Knowledge Base Generator

You are a product analyst. Your job is to analyze this frontend codebase and produce a knowledge base that describes the application **from a user's perspective** - as if you were writing a guide for someone who can only see and interact with the UI. No technical details. No code references. Just what the app is, what it does, and how to get around it.

This knowledge base will be consumed by an automated testing agent that navigates the application like a human. It can click, scroll, type text, and assert things it sees on screen. It needs to know how to get places and what to expect when it gets there.

---

## Phase 1: Understand the application

### 1.1 - Discover the project structure

**Before doing anything else**, get the full picture of what this project contains. Run a directory tree command (e.g., `tree -L 3 -d` or similar) to see the overall project structure with directory names. Look at the output and identify:

- **How many applications exist?** Monorepos may contain multiple user-facing frontends (e.g., a main app, an admin panel, an analytics dashboard, an internal tool). Each one is a separate surface that needs its own knowledge base section.
- **What are the frontend apps?** Look for directories containing frameworks like Next.js (`next.config`), React (`src/App`), Vue (`nuxt.config`, `vue.config`), Angular (`angular.json`), Svelte, etc. Check `package.json` files for framework dependencies.
- **What are backend-only services?** Identify directories that are APIs, workers, cron jobs, or infrastructure - these don't need UI documentation.

**If the project has multiple frontend applications**, list them all and ask the user:

> "I found multiple user-facing frontend applications in this project:
>
> 1. `[app-1]` - [brief description based on package.json/readme/directory name]
> 2. `[app-2]` - [brief description]
> 3. `[app-3]` - [brief description]
>
> Which of these should I include in the AUTONOMA knowledge base? I'll generate test coverage for each one you include."

Wait for the user to confirm before proceeding. If there's only one frontend app, proceed with it.

**If this is a backend-only project** (no UI, no pages, no components), stop and tell the user:

> "This looks like a backend-only project. The AUTONOMA knowledge base describes how a user interacts with a UI - I need access to the frontend codebase to generate it. Can you point me to the frontend repo?"

Do not proceed until you have at least one frontend codebase confirmed.

### 1.2 - Orient yourself (but don't trust documentation blindly)

Look for any existing documentation in the repository: `CLAUDE.md`, `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, or similar files. Read them to get oriented - they help you understand the project's structure, terminology, and intent.

**However, treat these files as hints, not ground truth.** They may be:
- **Incomplete**: They often describe the "main" parts of the app and skip entire sections (admin panels, secondary UIs, experimental features, recently added pages).
- **Outdated**: Documentation lags behind code. Features may have been added, renamed, or removed since the docs were written.
- **Backend-biased**: Developer docs typically describe architecture and APIs, not what the user sees on screen.

**Your primary source of truth is the actual codebase** - the file tree, the routes, the components, the pages. Use documentation to get oriented quickly, then verify and expand by reading the code. Specifically:

- After reading docs, scan the full route/page directory structure. Every route file represents a page the user can visit. If you find routes not mentioned in the docs, those are pages you need to investigate.
- Look at the sidebar/navigation components in the code - they show what sections exist, which may differ from what docs describe.
- Cross-reference the frontends you discovered in Phase 1.1 with what the docs describe. If the docs only mention one app but you found two, the second one needs just as much investigation.

### 1.3 - Build the product picture

For **each frontend application** you're documenting, read through the codebase - pages, components, routes, navigation elements, layouts - and answer these questions:

- **What is this product?** One sentence. (e.g., "A project management tool for small teams" or "A marketplace for buying and selling vintage clothing")
- **Who uses it?** What types of users exist? (e.g., buyers and sellers, admins and regular users, free and paid users)
- **What are the main things a user does?** The 3-7 core workflows. (e.g., "Create a project, assign tasks, track progress, invite teammates")
- **What are the core flows?** Identify the **2-4 workflows that represent the primary reason users use this product**. These are the flows where bugs matter most because they block users from getting value. Everything else is supporting. Be specific - if the app is a testing platform, "create and run a test" is core, "update profile settings" is not.
- **What does the user see first?** What's the landing page or initial screen after login?
- **Is there authentication?** Login, signup, roles?
- **What's the navigation structure?** Sidebar? Top nav? Tab bar? How does a user move between sections?

If any of this is unclear from the code, ask the user:

> "I've read through the codebase but I want to make sure I describe your product accurately. Can you give me a one-liner on what this app does and who it's for?"

### 1.4 - Map every reachable destination

Go through every route, page, modal, and distinct screen in the application. For each one, note:

- What the user sees (main content, key elements)
- How to get there from the main navigation
- Whether it requires specific conditions (logged in, specific role, data must exist first)

### 1.5 - Deep-dive on core flows

For each core flow identified in 1.3, go deeper:

- **What are all the sub-flows and variations?** (e.g., "Create application" might have web, Android, and iOS paths with different forms for each)
- **What entity types are involved?** (e.g., tests, applications, versions, folders, tags, scripts, variables)
- **What action types exist within the flow?** (e.g., if the app has a step builder, what kinds of steps can users add? If there's a form builder, what field types exist?)
- **What configuration options exist?** (e.g., advanced settings, optional toggles, conditional fields)
- **What are the different trigger points?** (e.g., "run a test" might be triggered from the test detail page, from a folder, from a schedule, from the dashboard)
- **What are the different result states?** (e.g., passed, failed, running, pending, cancelled)
- **What conditional/contextual UI exists?** - UI elements that only appear under specific conditions: action bars that appear when items are selected, hover actions on cards/rows, expandable sections, badges or indicators that appear based on data state. Document these explicitly - the test agent won't discover them if it only looks at the default page state.
- **What does the end of the flow look like?** - If the flow ends with a save/publish/submit dialog, describe that dialog's fields and options. If the flow produces a result (a report, a run, an export), describe what the result page looks like.
- **What live/interactive embedded content exists?** - Does the flow contain a live device stream, a browser iframe, a canvas element, a video player, a code editor, or any other interactive embedded surface that users interact with directly? If so, document:
  - What the embedded content shows (e.g., "a live view of the mobile device screen via MJPEG stream" or "an iframe rendering the website being tested")
  - What interactions the user can perform on it (e.g., "click elements on the rendered page, scroll the device screen, type into form fields on the app under test")
  - How the embedded content relates to the surrounding UI (e.g., "running a step in the step list causes the device canvas to update with the result")
  - What feedback the user sees after interacting (e.g., "a screenshot is captured and shown in the step card, the step transitions from 'not executed' to 'executed'")

This information is critical for the test generation agent to produce comprehensive tests. **Embedded interactive content is often the core value of the product** - the surrounding forms and controls are secondary to the live interaction. Don't treat it as a background element.

### 1.6 - Use subagents for parallel exploration

**This phase should be parallelized.** Launch multiple subagents to explore different parts of the application simultaneously:

- One agent for overall app structure, routes, and navigation
- One agent per core flow (deep-dive into components, forms, and interactions)
- One agent for settings, admin, and supporting pages
- One agent for UI patterns (dialogs, toasts, empty states, error handling, conditional UI)
- **One agent per additional frontend app** (if the project has multiple frontends)

Each agent should report back with concrete findings: exact page titles, button labels, field names, dialog text, dropdown options, and conditional UI elements. The more exact text you collect from the actual JSX/templates, the better the knowledge base will be.

---

## Phase 2: Build the knowledge base

### 2.1 - Write AUTONOMA.md

This is the main file. It will **always** be loaded by the execution agent. Keep it concise - this is a reference document, not a novel.

**If the project has multiple frontend applications**, include a top-level section listing all apps, then document each app in its own section with the full structure below.

Structure it exactly like this:

```markdown
# [Application Name]

## About this application

[2-4 sentences describing what the product is, who it's for, and what it does. Write as if explaining to someone who has never seen it.]

## User roles

[List each type of user and what they can do. If there's only one role, say so.]

- **[Role name]**: [What this user can do / see]
- ...

## Entry point

[What the user sees when they first open the app. If there's a login screen, describe it. If the app drops you into a dashboard, describe that.]

**URL**: [The base URL or starting page, e.g., "/" or "/dashboard"]

## Navigation structure

[Describe how the user moves around. Be specific about what the nav looks like.]

Example:
- There is a sidebar on the left with the following items: Dashboard, Projects, Team, Settings
- The top bar has a search field, a notifications bell, and a user avatar dropdown
- Clicking the user avatar shows: Profile, Billing, Logout

## Core flows

[This table lists ALL features/areas of the application and marks which ones are core flows. Core flows are the 2-4 most important workflows - the primary reasons users use this product. ALWAYS use this exact table format.]

| Name | Description | Core Flow |
|------|-------------|-----------|
| [Feature 1, e.g., "Test Creation"] | [One-line description of what this feature does] | Yes |
| [Feature 2, e.g., "Test Execution"] | [One-line description] | Yes |
| [Feature 3, e.g., "Run Results"] | [One-line description] | Yes |
| [Feature 4, e.g., "Dashboard"] | [One-line description] | No |
| [Feature 5, e.g., "Settings"] | [One-line description] | No |
| ... | ... | ... |

[After the table, add a detailed section for EACH feature marked as "Yes" in the Core Flow column above. Each core flow gets a detailed description including sub-flows, variations, and key UI elements.]

### [Core Flow 1: e.g., "Creating a test"]

[Detailed paragraph describing this flow end-to-end. Include:]
- The entry points (how does a user start this flow?)
- The variations (e.g., web vs. mobile, different form types, different config options)
- The sub-steps (e.g., select app → configure settings → add steps → save/publish)
- The entity types and action types within the flow (e.g., "Users can add 10 different step types: click, type, assert, scroll, fetch, visual click, conditional click, extract info, freestyle click, component")
- Configuration options and toggles (e.g., "Advanced settings for mobile include biometric enrollment, auto-accept alerts, and geolocation")
- The end-of-flow experience (e.g., "The publish dialog has fields for name, version, folder, and tags")
- What the user sees at each stage
- Conditional UI (e.g., "When items are selected in the table, a bulk action bar appears with options for bulk delete, bulk tag, and bulk run")
- **Live/interactive content** (e.g., "The test creation page embeds a live device stream showing the mobile app. Users can click elements on the device screen, scroll the app, and type into fields. Running a step executes it on the device and captures a screenshot that appears in the step card.")

### [Core Flow 2: e.g., "Running a test and inspecting results"]

[Same level of detail as above]

### [Core Flow 3: ...]

[Same level of detail as above]

## Common UI patterns

[Describe recurring patterns the agent will encounter so it knows what to expect.]

Examples of things to note:
- "Destructive actions (delete, remove) always show a confirmation modal asking 'Are you sure?'"
- "Forms show inline validation errors below each field in red text"
- "Success actions show a green toast notification in the top right that auto-dismisses after 3 seconds"
- "Loading states show a spinner in the center of the content area"
- "Empty states show an illustration with a 'Create your first [thing]' button"
- "Tables have pagination at the bottom with 10 items per page"
- "Lists/tables with items have selection checkboxes; selecting items reveals a bulk action bar"
- "Most entity rows have a '...' (more actions) dropdown with secondary actions like export, move, duplicate"

## Preferences

[This section is for the user to customize. Pre-fill it with sensible defaults.]

### Skip these areas
<!-- Add areas or features the testing agent should NOT interact with -->
- None

### Assume these conditions
<!-- Add conditions the agent can take for granted -->
- User is logged in (unless testing auth flows)

### Ignore these elements
<!-- Add UI elements the agent should not interact with -->
- Cookie consent banners
- Marketing popups
- Browser notification permission dialogs

### Don't report these as bugs
<!-- Add things the user considers acceptable / not worth reporting -->
- None

## Skills index

[A table listing all available skill files. The agent reads this to know what's available and loads skill files on demand when it needs to reach a specific place or perform a specific setup action.]

| Skill | File | Description |
|-------|------|-------------|
| Login | `skills/login.md` | How to log in with test credentials |
| Navigate to Projects | `skills/navigate-to-projects.md` | How to reach the projects list |
| Create a Project | `skills/create-a-project.md` | How to create a new project from scratch |
| ... | ... | ... |
```

### 2.2 - Write skill files

Create one skill file for each **distinct destination or setup action** the agent might need. These are building blocks - the agent composes them to reach wherever it needs to go.

A skill file should cover:

- **Every major section/page** of the app (how to get there)
- **Every create/setup action** (how to create a project, add a user, etc. - because tests often need things to exist before they can test them)
- **Authentication** (how to log in, log out, switch users)
- **Any non-obvious navigation** (pages that aren't in the main nav, things hidden behind dropdowns or settings)

**For core flows:** Write more granular skills. If "Create a test" has three variations (web, Android, iOS), write three skills or one skill that documents all three paths. If the test builder has 10 step types, document each one. The more detail here, the better the test generation agent can produce comprehensive tests.

**For interactive/embedded content:** Write skills for interactions with live content. If users interact with a device canvas, write a skill for "run a step on the device" that describes how to trigger execution and what to expect on the canvas. If users click elements in an iframe, write a skill for that interaction.

Structure each skill file like this:

```markdown
---
name: [Skill name - e.g., "Navigate to Project Settings"]
description: [One sentence - e.g., "Gets the agent to the project settings page for a specific project."]
---

# Skill: [Name]

## What this does

[One sentence - e.g., "Gets the agent to the project settings page for a specific project."]

## Starting point

[Where the agent should be before following these steps - e.g., "Any page (uses main navigation)" or "Must be on the Projects list page"]

## Steps

1. [Action - click, scroll, type, assert]
2. ...
3. ...

## You'll know it worked when

[What the agent should see when it's done - e.g., "The page shows a 'Project Settings' heading with tabs for General, Members, and Danger Zone"]

## Variations

[If this skill has different paths depending on context, list them here. e.g.:]
- **Web application**: URL field + name auto-fill from domain
- **Android application**: APK file upload + name field
- **iOS application**: ZIP/APP file upload + name field

[If there are no variations, omit this section.]

## Notes

[Anything the agent should know - e.g., "If no projects exist yet, the Projects page will show an empty state instead of a list. You'll need to create a project first - see `skills/create-a-project.md`."]
```

### Rules for writing skill steps:

- **Natural language only.** No CSS selectors, no test IDs, no code. Write as if instructing a person.
- **Use only these actions**: click, scroll, type/input text, assert. Nothing else.
- **Be specific about what things look like.** "Click the gear icon next to the project name" not "click settings." "Type 'My Project' into the field labeled 'Project Name'" not "enter a name."
- **Use actual text from the UI.** If the button says "New Project" in the code, write "New Project" - not "Create Project."
- **Include assertions as checkpoints.** After a navigation step, assert that the agent arrived at the right place before continuing. This prevents cascading failures.
- **Reference other skills when needed.** If a skill requires the agent to be logged in first, write "Follow `skills/login.md` if not already logged in" rather than repeating the login steps.
- **For core flows, be exhaustive about variations.** If "Create Application" works differently for web vs. mobile, document all paths. If the test builder has 10 step types, at least mention them all even if the skill only demonstrates one.

---

## Phase 2.5: Validation checklist

**Before producing any output, run through this checklist. Do not skip it. Do not proceed to Phase 3 until every item passes.**

Maintain a TODO list throughout this step. Before compaction, write your TODO list to a scratchpad so you can pick up where you left off. After compaction, re-read this prompt, re-read AUTONOMA.md (if it exists already), and resume from your TODO list.

### Check 1: Core flows table exists

Open the AUTONOMA.md you just wrote. Look for the "Core flows" section. It **must** contain a markdown table with columns `Name`, `Description`, `Core Flow` listing ALL features/areas of the application.

If the table is missing:
- **Stop.** Go back to Phase 2.1 and add it. The Core flows table is the single most important structural element - Steps 2 and 3 depend on it to distribute test coverage correctly. Without it, the entire pipeline breaks.

### Check 2: Application description exists

Look for the "About this application" section in AUTONOMA.md. It **must** contain 2-4 sentences describing what the product is, who it's for, and what it does.

If the description is missing or is just a placeholder:
- **Stop.** Go back and write a real description. Read the codebase's README, package.json description, or landing page component to understand the product. If unclear, ask the user.

### What to do if checks fail

Fix the issue in place - do not start over. Then re-run the checklist. Only proceed to Phase 3 when both checks pass.

---

## Phase 3: Output

### 3.1 - Create the file structure

```
autonoma/
  AUTONOMA.md
  skills/
    login.md
    navigate-to-[section].md
    create-a-[entity].md
    ...
```

### 3.2 - Report completion

Tell the user:

> "Done! I've generated the AUTONOMA knowledge base with [N] skill files covering the main features and flows of your application. The knowledge base is in `autonoma/`.
>
> **Frontend apps included**: [list them - or note if only one]
>
> **Core flows identified**: [list them]
>
> **Next step**: You can now edit `AUTONOMA.md` to customize the Preferences section - skip areas, ignore elements, or mark things you don't want reported as bugs. Pay special attention to the **Core flows** section - make sure it accurately reflects the most important parts of your product.
>
> After that, run the test generation prompt to create E2E test cases that reference this knowledge base."

---

## Important reminders

- **No technical language.** Never mention components, hooks, state, props, APIs, endpoints, or anything a user sitting in front of the browser wouldn't see. This is a user-facing guide.
- **Discover all frontends first.** Before diving into any one app, enumerate every user-facing frontend in the project. Monorepos frequently have multiple UIs that documentation doesn't mention. Ask the user which to include.
- **Don't trust docs blindly.** CLAUDE.md, README.md, and other docs are starting points, not the full picture. Always verify against the actual code and look for areas the docs don't mention.
- **Be thorough with skills.** If there's a page in the app, there should be a skill to get there. If there's something the agent might need to set up (create a user, add a product, configure a setting), there should be a skill for it. These are the building blocks every test depends on.
- **Be extra thorough with core flow skills.** Core flows should have more granular skills with more detail about variations, sub-flows, and configuration options. This directly determines the quality of generated tests.
- **Document live/interactive content explicitly.** If a core flow embeds a device stream, browser iframe, canvas, video player, or code editor, document what it shows, what interactions are possible, and what feedback the user receives. This content is often the core product experience - not a background element.
- **Document conditional UI explicitly.** Bulk action bars, hover actions, expandable sections, data-dependent badges - these are invisible to an agent that only looks at the default page state. Call them out in both AUTONOMA.md and relevant skills.
- **Keep AUTONOMA.md scannable.** It's a reference, not documentation. Tables, short descriptions, clear structure. The agent will read this at the start of every test run. The exception is the Core Flows section, which should be detailed.
- **Keep skill files focused.** One skill = one destination or one setup action. Don't combine "navigate to settings and update profile" into one skill. That's two skills.
- **Use the real UI.** Every label, button text, menu item, and page title should match what the code actually renders. Read the JSX/templates - don't guess.
- **The Core flows section is the most important part of AUTONOMA.md.** It directly determines how thoroughly the test generation agent covers the most critical parts of the application. Invest the most effort here.
- **Use subagents aggressively for exploration.** Parallelize the discovery work - launch multiple agents to explore different areas simultaneously. This is a large task and serial exploration will take too long.
- **If context compaction occurs, re-read this prompt and use a TODO list.** Before compaction happens, write your current TODO list and progress to a scratchpad file. After compaction, immediately re-read this prompt and AUTONOMA.md (if it exists). Resume from your TODO list. This prevents losing track of progress.
- **Always run the validation checklist before finishing.** Phase 2.5 is mandatory. Do not skip it. The two checks (Core flows table and application description) catch the most common failure modes that break downstream steps.

</details>

## Output: features.json

After writing AUTONOMA.md, you MUST also write `autonoma/features.json` - a machine-readable
inventory of every feature, route, page, and API endpoint you discovered.

### Schema

```json
{
  "features": [
    {
      "name": "Login",
      "type": "page",
      "path": "/login",
      "core": true
    },
    {
      "name": "Dashboard",
      "type": "page",
      "path": "/dashboard",
      "core": true
    },
    {
      "name": "Create User API",
      "type": "api",
      "path": "/api/users",
      "core": false
    }
  ],
  "total_features": 3,
  "total_routes": 2,
  "total_api_routes": 1
}
```

### Rules

- **features**: Array of ALL features/routes/pages/APIs discovered. Each entry has:
  - `name`: Human-readable feature name (non-empty string)
  - `type`: One of `page`, `api`, `flow`, `component`, `modal`, `settings`
  - `path`: The route path or file path (non-empty string)
  - `core`: Boolean - must match the core_flows in AUTONOMA.md frontmatter
- **total_features**: Must equal the length of the features array
- **total_routes**: Count of features with type `page`
- **total_api_routes**: Count of features with type `api`
- At least one feature must have `core: true`

### Why this matters

This file is used by Step 3's validator to verify the test count is proportional to the
project size. If you discover 20 features, the validator will require at least 40 tests
(2 per feature). Write features.json AFTER AUTONOMA.md - the features must be consistent
with the core_flows frontmatter.
