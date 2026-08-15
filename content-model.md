# Minimal Content Model

Each file under `pages/` owns one public route. YAML frontmatter is normalized to JSON and validated by `schemas/page.schema.json`; the Markdown body supplies content for the declared sections in the same order.

## Frontmatter

Required fields:

```yaml
---
id: product-analytics
route: /products/analytics
page_type: product
status: draft
title: Product Analytics
seo_title: Product Analytics for B2B SaaS | Minimal
seo_description: Understand how users navigate, adopt, and find value across your B2B software product.
audiences: [product-leaders, product-managers]
primary_cta: request-demo
related_pages: [/solutions/product-teams]
sections: [hero, proof, capabilities, workflow, use-cases, related-resources, final-cta]
claims: []
---
```

IDs and references use lowercase kebab-case. Routes are root-relative, lowercase, and omit trailing slashes. `audiences` and `primary_cta` resolve against `site.md`; `related_pages` resolve against its route registry.

## Body grammar

Each declared section appears once as an H2 heading with an explicit stable ID:

```markdown
## Hero {#hero}

Page copy belongs here.
```

Section IDs in the body must match `sections` exactly and in order. H3 headings may structure content inside a section. Internal links use public root-relative routes rather than source-file paths.

## Section profiles

| Profile | Required sequence |
|---|---|
| `home` | hero, proof, product-suite, outcomes, customer-evidence, resources, final-cta |
| `product-overview` | hero, proof, capabilities, workflow, product-links, final-cta |
| `product-detail` | hero, proof, capabilities, workflow, use-cases, related-resources, final-cta |
| `solution-detail` | hero, problems, outcomes, workflow, related-products, proof, final-cta |
| `industry-detail` | hero, industry-context, constraints, outcomes, related-products, proof, final-cta |
| `pricing` | hero, packages, comparison, faq, final-cta |
| `resource-index` | hero, featured-resource, resource-feed, final-cta |
| `resource-detail` | hero, resource-meta, learning-outcomes, summary, download-cta |
| `blog-index` | hero, featured-post, post-feed, newsletter-cta |
| `blog-post` | article-header, article-body, related-resources, editorial-cta |
| `company` | hero, story, principles, proof, final-cta |
| `customer-index` | hero, customer-stories, outcomes, final-cta |
| `contact` | hero, contact-options, response-expectations |
| `careers` | hero, employer-story, principles, open-roles, final-cta |
| `legal` | legal-header, legal-body |
| `landing` | hero, proof, outcomes, offer, faq, final-cta |

The profile is resolved from `site.md`. A page issue may not invent a new section type or sequence; changing a profile requires a content-model migration issue.

## Claims

Register claims that appear in titles, metadata, CTAs, or body copy. Quantitative metrics, customer identities, certifications, and analyst recognition use `treatment: demo`, include `demo_label: Demo only`, and display the label adjacent to the rendered claim. Other substantiated claims include approved evidence.

The repository validator performs cross-file checks that JSON Schema cannot: global ID and route uniqueness, route-to-file mapping, shared references, section/body matching, internal links, claim placement, and single-file issue scope.
