import assert from "node:assert/strict";
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateRepository } from "../scripts/lib/validator.mjs";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(testDirectory, "..");
const validPagePath = path.join(testDirectory, "fixtures/product-analytics.md");

async function makeRepository(t, { page = null, mutateSite = null } = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), "minimal-validator-"));
  t.after(() => rm(root, { recursive: true, force: true }));

  await mkdir(path.join(root, "schemas"), { recursive: true });
  await cp(path.join(repositoryRoot, "site.md"), path.join(root, "site.md"));
  await cp(path.join(repositoryRoot, "content-model.md"), path.join(root, "content-model.md"));
  await cp(
    path.join(repositoryRoot, "schemas/page.schema.json"),
    path.join(root, "schemas/page.schema.json"),
  );

  if (mutateSite) {
    const source = await readFile(path.join(root, "site.md"), "utf8");
    await writeFile(path.join(root, "site.md"), mutateSite(source));
  }

  if (page !== null) {
    const target = path.join(root, "pages/products/analytics.md");
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, page);
  }

  return root;
}

function codes(result) {
  return result.errors.map((error) => error.code);
}

test("accepts the registered 30-route graph before page files exist", async () => {
  const root = await makeRepository(test);
  const result = await validateRepository(root);

  assert.deepEqual(result.summary, { routes: 30, pages: 0, errors: 0 });
});

test("accepts a page that matches its schema, registry, profile, links, and sections", async (t) => {
  const page = await readFile(validPagePath, "utf8");
  const root = await makeRepository(t, { page });
  const result = await validateRepository(root);

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.summary, { routes: 30, pages: 1, errors: 0 });
});

test("rejects duplicate registry IDs, routes, and files", async (t) => {
  const root = await makeRepository(t, {
    mutateSite: (source) => source.replace(
      "  - { id: products, route: /products, file: pages/products/index.md,",
      "  - { id: home, route: /, file: pages/home.md,",
    ),
  });
  const result = await validateRepository(root);

  assert.ok(codes(result).includes("registry.duplicate-id"));
  assert.ok(codes(result).includes("registry.duplicate-route"));
  assert.ok(codes(result).includes("registry.duplicate-file"));
});

test("rejects malformed frontmatter and schema violations", async (t) => {
  const page = (await readFile(validPagePath, "utf8"))
    .replace("id: product-analytics", "id: product-analytics\nid: duplicate")
    .replace("status: draft", "status: invented");
  const root = await makeRepository(t, { page });
  const result = await validateRepository(root);

  assert.ok(codes(result).includes("frontmatter.invalid"));
});

test("rejects registry, audience, CTA, related-route, and link mismatches", async (t) => {
  const page = (await readFile(validPagePath, "utf8"))
    .replace("route: /products/analytics", "route: /products/feedback")
    .replace("audiences: [product-leaders, product-managers]", "audiences: [unknown-audience]")
    .replace("primary_cta: request-demo", "primary_cta: unknown-cta")
    .replace("related_pages: [/solutions/product-teams]", "related_pages: [/missing]")
    .replace("[Read the benchmark](/resources/product-adoption-benchmark)", "[Missing](/missing)");
  const root = await makeRepository(t, { page });
  const result = await validateRepository(root);

  assert.ok(codes(result).includes("page.registry-mismatch"));
  assert.ok(codes(result).includes("reference.audience"));
  assert.ok(codes(result).includes("reference.cta"));
  assert.ok(codes(result).includes("reference.route"));
  assert.ok(codes(result).includes("link.unknown-route"));
});

test("rejects missing, duplicate, unordered, and invented section IDs", async (t) => {
  const page = (await readFile(validPagePath, "utf8"))
    .replace("sections: [hero, proof, capabilities, workflow, use-cases, related-resources, final-cta]", "sections: [hero, proof, capabilities, invented-profile-section, use-cases, related-resources, final-cta]")
    .replace("## Proof {#proof}", "## Proof {#hero}")
    .replace("## Workflow {#workflow}", "## Workflow")
    .replace("## Use cases {#use-cases}", "## Use cases {#invented}");
  const root = await makeRepository(t, { page });
  const result = await validateRepository(root);

  assert.ok(codes(result).includes("section.missing-id"));
  assert.ok(codes(result).includes("section.duplicate-id"));
  assert.ok(codes(result).includes("section.frontmatter-mismatch"));
  assert.ok(codes(result).includes("section.profile-mismatch"));
});

test("rejects claims outside declared sections or without literal demo treatment", async (t) => {
  const claim = `claims:
  - id: adoption-claim
    category: quantitative
    statement: 42% faster adoption
    treatment: demo
    demo_label: Demo only
    section_ids: [missing-section]`;
  const page = (await readFile(validPagePath, "utf8")).replace("claims: []", claim);
  const root = await makeRepository(t, { page });
  const result = await validateRepository(root);

  assert.ok(codes(result).includes("claim.unknown-section"));
  assert.ok(codes(result).includes("claim.statement-missing"));
  assert.ok(codes(result).includes("claim.demo-label-missing"));
});

test("page-issue scope permits exactly its registered route file", async (t) => {
  const page = await readFile(validPagePath, "utf8");
  const root = await makeRepository(t, { page });

  const valid = await validateRepository(root, {
    expectedRoute: "/products/analytics",
    changedFiles: ["pages/products/analytics.md"],
  });
  assert.deepEqual(valid.errors, []);

  const invalid = await validateRepository(root, {
    expectedRoute: "/products/analytics",
    changedFiles: ["pages/products/analytics.md", "site.md"],
  });
  assert.ok(codes(invalid).includes("scope.changed-files"));
});
