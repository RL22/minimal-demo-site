import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { parseDocument } from "yaml";

function diagnostic(file, line, code, message) {
  return { path: file, line, code, message };
}

function strictYaml(source, file, lineOffset = 0) {
  if (/(^|\s)[&*][A-Za-z0-9_-]+/.test(source) || /^\s*!\S+/m.test(source)) {
    return {
      value: null,
      errors: [diagnostic(file, lineOffset + 1, "frontmatter.invalid", "YAML aliases, anchors, and custom tags are not allowed")],
    };
  }

  const document = parseDocument(source, {
    prettyErrors: false,
    strict: true,
    uniqueKeys: true,
  });
  if (document.errors.length > 0) {
    return {
      value: null,
      errors: document.errors.map((error) => diagnostic(
        file,
        lineOffset + (error.linePos?.[0]?.line ?? 1),
        "frontmatter.invalid",
        error.message,
      )),
    };
  }

  let value;
  try {
    value = document.toJS({ maxAliasCount: 0 });
  } catch (error) {
    return {
      value: null,
      errors: [diagnostic(file, lineOffset + 1, "frontmatter.invalid", error.message)],
    };
  }

  if (!value || Array.isArray(value) || typeof value !== "object") {
    return {
      value: null,
      errors: [diagnostic(file, lineOffset + 1, "frontmatter.invalid", "YAML frontmatter must be an object")],
    };
  }
  return { value, errors: [] };
}

function extractFrontmatter(source, file) {
  if (!source.startsWith("---\n") && !source.startsWith("---\r\n")) {
    return {
      data: null,
      body: "",
      bodyLine: 1,
      errors: [diagnostic(file, 1, "frontmatter.invalid", "Frontmatter must begin at byte one")],
    };
  }

  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    return {
      data: null,
      body: "",
      bodyLine: 1,
      errors: [diagnostic(file, 1, "frontmatter.invalid", "Frontmatter is not closed")],
    };
  }

  const parsed = strictYaml(match[1], file, 1);
  return {
    data: parsed.value,
    body: source.slice(match[0].length),
    bodyLine: match[0].split(/\r?\n/).length,
    errors: parsed.errors,
  };
}

function parseProfiles(source) {
  const profiles = new Map();
  const errors = [];
  for (const [index, line] of source.split(/\r?\n/).entries()) {
    const match = line.match(/^\| `([a-z][a-z0-9-]*)` \| ([a-z0-9, -]+) \|$/);
    if (!match) continue;
    const sequence = match[2].split(",").map((item) => item.trim());
    if (profiles.has(match[1])) {
      errors.push(diagnostic("content-model.md", index + 1, "profile.duplicate", `Duplicate profile: ${match[1]}`));
    }
    profiles.set(match[1], sequence);
  }
  if (profiles.size === 0) {
    errors.push(diagnostic("content-model.md", 1, "profile.missing", "No section profiles were found"));
  }
  return { profiles, errors };
}

function duplicates(items, property) {
  const seen = new Set();
  const duplicate = new Set();
  for (const item of items) {
    const value = item?.[property];
    if (seen.has(value)) duplicate.add(value);
    seen.add(value);
  }
  return duplicate;
}

function nodeText(node) {
  if (typeof node.value === "string") return node.value;
  return (node.children ?? []).map(nodeText).join("");
}

function walk(node, visit) {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
}

function normalize(value) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function sameArray(left, right) {
  return Array.isArray(left)
    && Array.isArray(right)
    && left.length === right.length
    && left.every((value, index) => value === right[index]);
}

async function markdownFiles(directory) {
  const files = [];
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return files;
    throw error;
  }
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(absolute));
    if (entry.isFile() && entry.name.endsWith(".md")) files.push(absolute);
  }
  return files.sort();
}

function validateMarkdown(body, bodyLine, data, route, profiles, routeSet, file) {
  const errors = [];
  const tree = unified().use(remarkParse).parse(body);
  const sections = [];
  const links = [];
  walk(tree, (node) => {
    if (node.type === "heading" && node.depth === 2) {
      const heading = nodeText(node);
      const idMatch = heading.match(/\s+\{#([a-z][a-z0-9-]*)\}\s*$/);
      sections.push({
        id: idMatch?.[1] ?? null,
        line: bodyLine + (node.position?.start.line ?? 1) - 1,
        start: node.position?.start.offset ?? 0,
        end: body.length,
      });
    }
    if (node.type === "link" && typeof node.url === "string") links.push(node);
  });
  for (let index = 0; index < sections.length - 1; index += 1) {
    sections[index].end = sections[index + 1].start;
  }

  for (const section of sections) {
    if (!section.id) errors.push(diagnostic(file, section.line, "section.missing-id", "Every H2 section needs an explicit ID"));
  }
  const bodyIds = sections.map((section) => section.id).filter(Boolean);
  const seenIds = new Set();
  for (const section of sections) {
    if (!section.id) continue;
    if (seenIds.has(section.id)) {
      errors.push(diagnostic(file, section.line, "section.duplicate-id", `Duplicate section ID: ${section.id}`));
    }
    seenIds.add(section.id);
  }
  if (!sameArray(bodyIds, data.sections)) {
    errors.push(diagnostic(file, 1, "section.frontmatter-mismatch", "Body section IDs must match frontmatter exactly and in order"));
  }
  const required = profiles.get(route.profile);
  if (!required || !sameArray(data.sections, required)) {
    errors.push(diagnostic(file, 1, "section.profile-mismatch", `Sections do not match profile: ${route.profile}`));
  }

  for (const link of links) {
    if (!link.url.startsWith("/") || link.url.startsWith("//")) continue;
    const target = link.url.split(/[?#]/, 1)[0];
    if (!routeSet.has(target)) {
      errors.push(diagnostic(file, bodyLine + (link.position?.start.line ?? 1) - 1, "link.unknown-route", `Unknown internal route: ${target}`));
    }
  }

  const claims = Array.isArray(data.claims) ? data.claims : [];
  const claimIds = new Set();
  for (const claim of claims) {
    if (!claim || typeof claim !== "object") continue;
    if (claimIds.has(claim.id)) errors.push(diagnostic(file, 1, "claim.duplicate-id", `Duplicate claim ID: ${claim.id}`));
    claimIds.add(claim.id);
    for (const sectionId of claim.section_ids ?? []) {
      const section = sections.find((candidate) => candidate.id === sectionId);
      if (!section) {
        errors.push(diagnostic(file, 1, "claim.unknown-section", `Claim ${claim.id} references unknown section: ${sectionId}`));
        continue;
      }
      const sectionBody = body.slice(section.start, section.end);
      if (!normalize(sectionBody).includes(normalize(claim.statement ?? ""))) {
        errors.push(diagnostic(file, section.line, "claim.statement-missing", `Claim ${claim.id} statement is not present literally in section ${sectionId}`));
      }
      if (claim.treatment === "demo" && !sectionBody.includes("Demo only")) {
        errors.push(diagnostic(file, section.line, "claim.demo-label-missing", `Claim ${claim.id} needs Demo only in section ${sectionId}`));
      }
    }
    if ((claim.section_ids ?? []).every((id) => !sections.some((section) => section.id === id))) {
      if (!normalize(body).includes(normalize(claim.statement ?? ""))) {
        errors.push(diagnostic(file, 1, "claim.statement-missing", `Claim ${claim.id} statement is not present literally`));
      }
      if (claim.treatment === "demo" && !body.includes("Demo only")) {
        errors.push(diagnostic(file, 1, "claim.demo-label-missing", `Claim ${claim.id} needs visible Demo only treatment`));
      }
    }
  }
  return errors;
}

export async function validateRepository(root, options = {}) {
  const errors = [];
  const siteSource = await readFile(path.join(root, "site.md"), "utf8");
  const siteFrontmatter = extractFrontmatter(siteSource, "site.md");
  errors.push(...siteFrontmatter.errors);
  if (!siteFrontmatter.data) return { errors, summary: { routes: 0, pages: 0, errors: errors.length } };

  const registry = siteFrontmatter.data;
  const routes = Array.isArray(registry.routes) ? registry.routes : [];
  for (const [property, code] of [
    ["id", "registry.duplicate-id"],
    ["route", "registry.duplicate-route"],
    ["file", "registry.duplicate-file"],
  ]) {
    for (const value of duplicates(routes, property)) {
      errors.push(diagnostic("site.md", 1, code, `Duplicate route ${property}: ${value}`));
    }
  }

  const contentModel = await readFile(path.join(root, "content-model.md"), "utf8");
  const { profiles, errors: profileErrors } = parseProfiles(contentModel);
  errors.push(...profileErrors);
  const routeSet = new Set(routes.map((item) => item.route));
  const audienceSet = new Set(registry.audiences ?? []);
  const ctaSet = new Set(Object.keys(registry.ctas ?? {}));
  const routeByFile = new Map(routes.map((item) => [item.file, item]));

  for (const route of routes) {
    if (!profiles.has(route.profile)) {
      errors.push(diagnostic("site.md", 1, "profile.unknown", `Route ${route.id} uses unknown profile: ${route.profile}`));
    }
  }
  for (const [id, cta] of Object.entries(registry.ctas ?? {})) {
    if (!routeSet.has(cta.href)) errors.push(diagnostic("site.md", 1, "reference.cta-route", `CTA ${id} uses unknown route: ${cta.href}`));
  }

  const schema = JSON.parse(await readFile(path.join(root, "schemas/page.schema.json"), "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
  addFormats(ajv);
  const validateSchema = ajv.compile(schema);
  const pagePaths = await markdownFiles(path.join(root, "pages"));

  for (const absolute of pagePaths) {
    const file = path.relative(root, absolute).split(path.sep).join("/");
    const source = await readFile(absolute, "utf8");
    const frontmatter = extractFrontmatter(source, file);
    errors.push(...frontmatter.errors);
    if (!frontmatter.data) continue;
    const data = frontmatter.data;
    if (!validateSchema(data)) {
      for (const schemaError of validateSchema.errors ?? []) {
        errors.push(diagnostic(file, 1, "schema.invalid", `${schemaError.instancePath || "/"} ${schemaError.message}`));
      }
    }

    const route = routeByFile.get(file);
    if (!route) {
      errors.push(diagnostic(file, 1, "page.orphan", "Page file is not registered in site.md"));
      continue;
    }
    if (data.id !== route.id || data.route !== route.route || data.page_type !== route.page_type || !sameArray(data.audiences, route.audiences)) {
      errors.push(diagnostic(file, 1, "page.registry-mismatch", "Page identity, route, type, and audiences must match site.md"));
    }
    for (const audience of data.audiences ?? []) {
      if (!audienceSet.has(audience)) errors.push(diagnostic(file, 1, "reference.audience", `Unknown audience: ${audience}`));
    }
    if (!ctaSet.has(data.primary_cta)) errors.push(diagnostic(file, 1, "reference.cta", `Unknown CTA: ${data.primary_cta}`));
    for (const related of data.related_pages ?? []) {
      if (!routeSet.has(related)) errors.push(diagnostic(file, 1, "reference.route", `Unknown related route: ${related}`));
    }
    errors.push(...validateMarkdown(frontmatter.body, frontmatter.bodyLine, data, route, profiles, routeSet, file));
  }

  if (options.expectedRoute !== undefined || options.changedFiles !== undefined) {
    const expected = routes.find((item) => item.route === options.expectedRoute);
    if (!expected) {
      errors.push(diagnostic("site.md", 1, "scope.unknown-route", `Unknown expected route: ${options.expectedRoute}`));
    } else if (!sameArray(options.changedFiles ?? [], [expected.file])) {
      errors.push(diagnostic(expected.file, 1, "scope.changed-files", `Page issue may change only ${expected.file}`));
    }
  }

  errors.sort((left, right) => left.path.localeCompare(right.path) || left.line - right.line || left.code.localeCompare(right.code));
  return { errors, summary: { routes: routes.length, pages: pagePaths.length, errors: errors.length } };
}
