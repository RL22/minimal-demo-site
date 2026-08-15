# Minimal — Agent Contract

This repository turns approved GitHub page issues into canonical Markdown. One issue owns one route file and stops at a review-ready pull request.

## Load context

1. Read `site.md` to resolve the issue route into its page ID, target file, page type, audiences, and section profile.
2. Read `brand.md` for voice, claims, design, accessibility, and identity rules.
3. Read `content-model.md` for frontmatter and section grammar.
4. Read the issue for page-specific outcome, sources, requirements, risks, dependencies, and human decisions.

Context is complete when every required input has one authoritative source and all referenced IDs resolve.

## Build one page

1. Confirm the route exists in `site.md` and no other active issue owns its target file.
2. Confirm dependencies and human decisions are resolved before changing files.
3. Create or modify exactly the registered file under `pages/`.
4. Match frontmatter to `schemas/page.schema.json` and body sections to the registered section profile.
5. Use root-relative internal links and shared CTA/audience IDs from `site.md`.
6. Register every claim in frontmatter. Show `Demo only` beside fictional metrics, customers, certifications, or endorsements in rendered content.
7. Run the repository validator against the complete content graph.
8. Report the commit, changed file, commands, exit status, and acceptance-criteria evidence.

The page is complete when its issue acceptance criteria pass, repository validation is green, the diff contains only its registered route file, and evidence is attached for human review.

## Shared changes

Changes to `AGENTS.md`, `brand.md`, `site.md`, `content-model.md`, `schemas/`, automation, or more than one route require a separate foundation or migration issue. Page issues treat those files as read-only.

## Human gates

Human approval controls brand positioning, claims policy, schema migrations, representative page quality, and merge. Agents stop at review and never publish or deploy during the pilot.
