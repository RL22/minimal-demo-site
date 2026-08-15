# Minimal Brand System

Minimal is a fictional B2B SaaS product-experience platform. Its brand combines editorial restraint with product evidence: quiet foundations, decisive typography, and structured proof.

## Source and derivation

The visual foundation was extracted from `https://www.ycombinator.com/` on 2026-08-15. Raw observations live in `generated/ycombinator-design/`.

The raw extraction is research, not implementation truth. Minimal adopts the source's restraint, serif/sans contrast, generous rhythm, modular grids, modest radii, and sparse elevation. Minimal uses its own palette roles, font pairing, controls, imagery, voice, logo geometry, information architecture, and responsive system.

## Brand character

- **Quiet:** neutral surfaces give content and product evidence room.
- **Exact:** short claims, explicit labels, and visible structure.
- **Editorial:** serif display type creates moments of reflection and authority.
- **Operational:** sans-serif interface type keeps navigation and product language clear.
- **Credible:** workflows, diagrams, and product UI carry proof.

## Color

| Token | Value | Use |
|---|---|---|
| `canvas` | `#F5F5EE` | Primary page background |
| `surface` | `#FFFFFF` | Cards, menus, tables, product frames |
| `ink` | `#16140F` | Primary text and dark surfaces |
| `muted` | `#6B675B` | Secondary text; 5.16:1 on canvas |
| `border` | `#D8D6CC` | Rules, card boundaries, dividers |
| `accent` | `#176B5B` | Primary actions, links, active states |
| `accent-hover` | `#0F5146` | Hover and pressed emphasis |
| `on-accent` | `#FFFFFF` | Text and icons on accent surfaces |

Use color semantically. Canvas, surface, ink, and border form most compositions. Accent identifies action or current state rather than decorating large areas.

## Typography

- **Display:** Literata, Georgia, serif
- **Interface:** IBM Plex Sans, system-ui, sans-serif
- **Code/data:** IBM Plex Mono, ui-monospace, monospace

| Role | Desktop | Compact |
|---|---|---|
| Display | `400 64px/68px` | `400 44px/48px` |
| H1 | `400 48px/56px` | `400 36px/42px` |
| H2 | `400 32px/40px` | `400 28px/36px` |
| H3 | `400 22px/28px` | `400 20px/26px` |
| Body | `400 16px/24px` | same |
| Small | `400 14px/20px` | same |
| Label | `600 12px/16px` | same |

Display type is primarily upright. Italics may emphasize a short phrase, never carry functional copy. Body and control text use weights of 400 or higher.

## Spacing and geometry

Use a 4px foundation:

```text
4, 8, 12, 16, 24, 32, 48, 80, 120px
```

- Component gaps: 8–24px
- Grid gaps: 24–32px
- Standard section padding: 80px desktop, 48px compact
- Editorial section padding: 120px desktop, 80px compact
- Text measure: 40–68 characters depending on role
- Content containers: 720px reading, 1120px standard, 1280px wide
- Radii: 4px controls, 8px surfaces, 12px media
- Border: 1px solid `border`
- Floating elevation: `0 8px 24px rgba(22, 20, 15, 0.08)`

Content cards use borders or surface contrast. Shadows identify overlays, menus, and floating UI.

## Responsive system

Design and validate at these behavioral ranges:

- Compact: 320–767px
- Tablet: 768–1023px
- Desktop: 1024–1439px
- Wide: 1440px and above

Three-column grids collapse to two, then one. Text measures remain capped while surrounding layouts expand. Navigation becomes a keyboard-operable drawer on compact screens.

## Composition

Minimal pages alternate three densities:

1. **Editorial:** one decisive statement with generous whitespace.
2. **Evidence:** product UI, workflow diagrams, metrics, or customer proof.
3. **Structured:** grids, comparisons, FAQs, resource lists, and navigation.

The homepage may use editorial spacing several times. Routine product, solution, resource, and legal pages use standard spacing so the 30-page site remains navigable and efficient.

## Component vocabulary

### Foundations

- Shell, content container, text measure
- Compact, standard, and editorial sections
- Display heading, section heading, eyebrow, body, metadata
- Inline link, arrow link, divider, surface

### Navigation

- Global header and mobile drawer
- Product, solutions, and resources menus
- Section subnavigation and breadcrumbs
- Sitemap footer with legal row

### Marketing sections

- Editorial hero and product hero
- Proof bar and authorized logo cloud
- Feature narrative and product screenshot frame
- Capability grid and metric strip
- Customer quote and customer-story feature
- Integration grid, resource feed, comparison table, pricing grid, FAQ
- Closing CTA

### Purpose-specific cards

- Feature card
- Resource card
- Customer-story card
- Integration card
- Metric card
- Event card

Each card type owns a fixed content contract. A generic card does not accept arbitrary mixtures of images, metrics, prose, and actions.

## Controls and states

Primary buttons use the accent surface, white text, a 6px radius, and 16px interface type. Secondary buttons use canvas or surface with a visible border. Tertiary actions use underlined text or an arrow-link treatment.

Every interactive component defines default, hover, focus-visible, active, loading, disabled, error, and selected states. Targets are at least 44×44px where practical. Focus uses a visible 2px accent ring with a 2px offset.

## Imagery

Prioritize:

- original product interface captures;
- workflow and systems diagrams;
- abstract data compositions;
- licensed customer environments;
- restrained object photography.

Minimal's identity is product-led. Founder grids, accelerator events, portfolio logo walls, portrait-overlay cards, and borrowed third-party imagery remain source references only and do not ship.

## Voice

Minimal writes with calm confidence:

- lead with the user's operating problem;
- use concrete product and workflow language;
- keep headings short;
- prefer active verbs and direct sentences;
- connect each capability to an observable outcome;
- label fictional claims and demo evidence visibly.

Preferred CTA patterns: `See Minimal in action`, `Explore analytics`, `Review the workflow`, `Read the guide`, and `Request a demo`.

## Motion

- Fast feedback: 150ms
- Standard transition: 200ms
- Deliberate reveal: 400ms
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`

Motion uses opacity or translation of 4px or less. Reduced-motion mode removes transforms and nonessential animation while preserving state changes.

## Accessibility contract

- Every rendered text and UI-state pair passes WCAG 2.2 AA.
- Inline links are underlined and distinguishable without color.
- Pages use one header, labeled navigation, one main landmark, ordered headings, named sections, and one footer.
- Keyboard order, menu behavior, image alternatives, form labels, errors, and live announcements are testable.
- Validate at 320px, 768px, 1280px, 200% zoom, and 400% reflow.
- The raw extractor's 100% score is not accepted as evidence; it tested only two color pairs.

## Identity and rights boundary

Minimal uses an original wordmark and a proprietary line/grid motif. Shipped assets contain no YC names, initials, marks, slogans, program language, people, portfolio brands, URLs, metadata, or unlicensed imagery. The orange square, black pill CTA, founder-photo grids, and accelerator composition do not become Minimal components.

Before public commercial use, complete rights checks for fonts and imagery plus word-mark and design-mark clearance for `Minimal`.

## Completion criterion

The brand implementation is complete when semantic tokens replace raw extraction values, all component states and responsive behaviors are documented, WCAG checks pass against rendered pages, and a side-by-side review shows Minimal has a distinct palette accent, typography, controls, imagery, composition, and identity.
