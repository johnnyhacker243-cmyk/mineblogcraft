import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { localPaperPlugin } from "../scripts/local-paper-plugin.mjs";

test("Local paper route serves only verified files, never a proxy or arbitrary path", async () => {
  const dir = await mkdtemp(join(tmpdir(), "mineblogcraft-pdf-route-"));
  try {
    const root = pathToFileURL(dir + "/"),
      bytes = Buffer.from("%PDF-1.7\nlocal verified test fixture");
    const hash = createHash("sha256").update(bytes).digest("hex");
    await mkdir(join(dir, "public/papers"), { recursive: true });
    await mkdir(join(dir, ".local-reference/paper-pdfs"), { recursive: true });
    await writeFile(
      join(dir, "public/papers/fulltext-catalog.json"),
      JSON.stringify([{ sha256: hash }]),
    );
    await writeFile(
      join(dir, ".local-reference/paper-pdfs", hash + ".pdf"),
      bytes,
    );
    let handle;
    const plugin = localPaperPlugin(root);
    assert.equal(plugin.apply, "serve");
    await plugin.configureServer({
      middlewares: {
        use: (handler) => {
          handle = handler;
        },
      },
    });
    const request = async (url, method = "GET") => {
      const response = {
        headers: {},
        statusCode: 200,
        setHeader(k, v) {
          this.headers[k] = v;
        },
        end(data) {
          this.body = data;
        },
      };
      await handle({ url, method }, response, () => {
        response.next = true;
      });
      return response;
    };
    const valid = await request("/papers/local-fulltext/" + hash + ".pdf");
    assert.equal(valid.statusCode, 200);
    assert.equal(valid.headers["Content-Type"], "application/pdf");
    assert.deepEqual(valid.body, bytes);
    assert.equal(
      (await request("/papers/local-fulltext/" + hash + ".pdf", "HEAD")).body,
      undefined,
    );
    assert.equal(
      (await request("/papers/local-fulltext/../../.env")).statusCode,
      404,
    );
    assert.equal(
      (await request("/papers/local-fulltext/" + "0".repeat(64) + ".pdf"))
        .statusCode,
      404,
    );
    assert.equal(
      (await request("/papers/local-fulltext/" + hash + ".pdf", "POST"))
        .statusCode,
      405,
    );
    await writeFile(
      join(dir, ".local-reference/paper-pdfs", hash + ".pdf"),
      "tampered",
    );
    assert.equal(
      (await request("/papers/local-fulltext/" + hash + ".pdf")).statusCode,
      404,
    );
    assert.equal((await request("/other-file")).next, true);
  } finally {
    assert.equal(dirname(resolve(dir)), resolve(tmpdir()));
    await rm(dir, { recursive: true, force: true });
  }
});
