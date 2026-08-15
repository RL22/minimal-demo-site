---
site:
  id: minimal
  name: Minimal
  description: A fictional B2B SaaS product-experience platform.
  default_cta: request-demo
audiences:
  - product-leaders
  - product-managers
  - product-operations
  - customer-success-leaders
  - digital-adoption-leaders
ctas:
  request-demo:
    label: Request a demo
    href: /demo
  see-minimal:
    label: See Minimal in action
    href: /demo
  explore-analytics:
    label: Explore analytics
    href: /products/analytics
  read-guide:
    label: Read the guide
    href: /resources/product-adoption-benchmark
routes:
  - { id: home, route: /, file: pages/home.md, page_type: home, audiences: [product-leaders], profile: home }
  - { id: products, route: /products, file: pages/products/index.md, page_type: product, audiences: [product-leaders, product-managers], profile: product-overview }
  - { id: product-analytics, route: /products/analytics, file: pages/products/analytics.md, page_type: product, audiences: [product-leaders, product-managers], profile: product-detail }
  - { id: in-app-guidance, route: /products/in-app-guidance, file: pages/products/in-app-guidance.md, page_type: product, audiences: [product-managers, digital-adoption-leaders], profile: product-detail }
  - { id: feedback, route: /products/feedback, file: pages/products/feedback.md, page_type: product, audiences: [product-leaders, product-managers], profile: product-detail }
  - { id: solution-product-teams, route: /solutions/product-teams, file: pages/solutions/product-teams.md, page_type: solution, audiences: [product-leaders, product-managers, product-operations], profile: solution-detail }
  - { id: solution-customer-success, route: /solutions/customer-success, file: pages/solutions/customer-success.md, page_type: solution, audiences: [customer-success-leaders], profile: solution-detail }
  - { id: solution-employee-experience, route: /solutions/employee-experience, file: pages/solutions/employee-experience.md, page_type: solution, audiences: [digital-adoption-leaders], profile: solution-detail }
  - { id: solution-digital-adoption, route: /solutions/digital-adoption, file: pages/solutions/digital-adoption.md, page_type: solution, audiences: [digital-adoption-leaders], profile: solution-detail }
  - { id: industry-saas, route: /industries/saas, file: pages/industries/saas.md, page_type: industry, audiences: [product-leaders], profile: industry-detail }
  - { id: industry-financial-services, route: /industries/financial-services, file: pages/industries/financial-services.md, page_type: industry, audiences: [product-leaders, digital-adoption-leaders], profile: industry-detail }
  - { id: industry-healthcare, route: /industries/healthcare, file: pages/industries/healthcare.md, page_type: industry, audiences: [product-leaders, digital-adoption-leaders], profile: industry-detail }
  - { id: pricing, route: /pricing, file: pages/pricing.md, page_type: pricing, audiences: [product-leaders], profile: pricing }
  - { id: resources, route: /resources, file: pages/resources/index.md, page_type: resource, audiences: [product-managers, product-operations], profile: resource-index }
  - { id: product-adoption-benchmark, route: /resources/product-adoption-benchmark, file: pages/resources/product-adoption-benchmark.md, page_type: resource, audiences: [product-leaders, product-operations], profile: resource-detail }
  - { id: onboarding-webinar, route: /resources/onboarding-webinar, file: pages/resources/onboarding-webinar.md, page_type: resource, audiences: [product-managers, customer-success-leaders], profile: resource-detail }
  - { id: blog, route: /blog, file: pages/blog/index.md, page_type: blog_index, audiences: [product-managers], profile: blog-index }
  - { id: measure-product-adoption, route: /blog/measure-product-adoption, file: pages/blog/measure-product-adoption.md, page_type: blog_post, audiences: [product-managers, product-operations], profile: blog-post }
  - { id: in-app-onboarding-patterns, route: /blog/in-app-onboarding-patterns, file: pages/blog/in-app-onboarding-patterns.md, page_type: blog_post, audiences: [product-managers, digital-adoption-leaders], profile: blog-post }
  - { id: closing-feedback-loop, route: /blog/closing-the-feedback-loop, file: pages/blog/closing-the-feedback-loop.md, page_type: blog_post, audiences: [product-managers, customer-success-leaders], profile: blog-post }
  - { id: about, route: /company/about, file: pages/company/about.md, page_type: company, audiences: [product-leaders], profile: company }
  - { id: customers, route: /company/customers, file: pages/company/customers.md, page_type: company, audiences: [product-leaders], profile: customer-index }
  - { id: contact, route: /company/contact, file: pages/company/contact.md, page_type: company, audiences: [product-leaders], profile: contact }
  - { id: careers, route: /careers, file: pages/careers.md, page_type: careers, audiences: [product-managers], profile: careers }
  - { id: privacy, route: /legal/privacy, file: pages/legal/privacy.md, page_type: legal, audiences: [product-leaders], profile: legal }
  - { id: terms, route: /legal/terms, file: pages/legal/terms.md, page_type: legal, audiences: [product-leaders], profile: legal }
  - { id: cookies, route: /legal/cookies, file: pages/legal/cookies.md, page_type: legal, audiences: [product-leaders], profile: legal }
  - { id: demo, route: /demo, file: pages/landing/demo.md, page_type: landing, audiences: [product-leaders], profile: landing }
  - { id: lp-product-analytics, route: /lp/product-analytics, file: pages/landing/product-analytics.md, page_type: landing, audiences: [product-leaders, product-managers], profile: landing }
  - { id: lp-digital-adoption, route: /lp/digital-adoption, file: pages/landing/digital-adoption.md, page_type: landing, audiences: [digital-adoption-leaders], profile: landing }
---

# Minimal Site Registry

This frontmatter is the authoritative route, file, audience, CTA, and page-profile registry. The 30 routes are content targets; only route files that have passed review should be treated as publishable.

Navigation and footer structures will be added after representative pages prove the content model.
