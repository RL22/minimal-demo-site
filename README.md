# Minimal Demo Site

Minimal is a fictional, 30-route B2B SaaS marketing site and the pilot repository for an issue-driven dark factory.

The canonical source is Markdown:

- `brand.md` — brand, voice, design, claims, and accessibility
- `site.md` — route, file, audience, CTA, and profile registry
- `content-model.md` — page grammar and section profiles
- `pages/**/*.md` — one route per file
- `schemas/page.schema.json` — normalized frontmatter schema
- `design/minimal-design-system.html` — inline visual component reference

The pilot stops at validated, human-review-ready pull requests. Platform adapters and publishing remain backlog work.

## Validate the content contract

Use Node.js 18.17 or newer. Install the locked dependencies and run the same commands used by CI:

```sh
npm ci
npm test
npm run validate
```

`npm run validate` checks the complete content graph while allowing registered routes that have not been built yet. It exits `0` for valid content, `1` for content errors, and `2` when the validator itself cannot run.

For a page issue, also prove that the diff contains only its registered route file:

```sh
npm run validate -- \
  --route /products/analytics \
  --changed-file pages/products/analytics.md
```

Diagnostics use the stable format `path:line [rule-code] message` so local runs, agents, and CI report the same evidence.
