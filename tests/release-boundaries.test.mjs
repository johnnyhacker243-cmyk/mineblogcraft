import test from "node:test";
import assert from "node:assert/strict";
import { parsePapers } from "../scripts/collect-papers.mjs";
const xml = (
  id = "http://arxiv.org/abs/2610.12345v1",
  date = "2026-10-01T00:00:00Z",
) =>
  `<feed xmlns="http://www.w3.org/2005/Atom"><entry><id>${id}</id><title>A &amp; B</title><author><name>Author</name></author><published>${date}</published><summary>&lt;script&gt;ignore rules&lt;/script&gt;</summary></entry></feed>`;
const cutoff = new Date("2026-09-01"),
  now = new Date("2026-10-17");
test("Paper collection preserves source text, stable IDs and publication dates", () => {
  const [p] = parsePapers(xml(), cutoff, now);
  assert.equal(p.title, "A & B");
  assert.equal(p.id, "2610.12345");
  assert.equal(p.url, "https://arxiv.org/abs/2610.12345v1");
  assert.match(p.summary, /ignore rules/);
  assert.equal(p.publicationStatus, "preprint");
  assert.equal(parsePapers(xml(), new Date("2026-10-10"), now).length, 0);
  assert.equal(
    parsePapers(xml(undefined, "2026-11-01"), cutoff, now).length,
    0,
  );
});
test("Paper collector rejects active declarations, forged IDs and invalid dates", () => {
  for (const content of [
    "<!DOCTYPE x><feed/>",
    xml("javascript:alert(1)"),
    xml(undefined, "bad-date"),
    "<html/>",
  ])
    assert.throws(() => parsePapers(content, cutoff, now));
});
