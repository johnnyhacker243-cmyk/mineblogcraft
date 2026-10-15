import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Development-only static files. No fetching/proxying, no arbitrary paths,
// and no copyrighted original PDFs copied to the published site directory.
export function localPaperPlugin(root = new URL("../", import.meta.url)) {
  return {
    name: "verified-local-paper-files",
    apply: "serve",
    async configureServer(server) {
      const catalog = JSON.parse(
        await readFile(
          new URL("public/papers/fulltext-catalog.json", root),
          "utf8",
        ),
      );
      const known = new Set(catalog.map((p) => p.sha256));
      server.middlewares.use(async (request, response, next) => {
        const path = request.url?.split("?")[0] ?? "";
        if (!path.startsWith("/papers/local-fulltext/")) return next();
        const match = path.match(
          /^\/papers\/local-fulltext\/([a-f0-9]{64})\.pdf$/,
        );
        if (!match || !known.has(match[1])) {
          response.statusCode = 404;
          response.end();
          return;
        }
        if (!["GET", "HEAD"].includes(request.method)) {
          response.statusCode = 405;
          response.end();
          return;
        }
        try {
          const bytes = await readFile(
            new URL(`.local-reference/paper-pdfs/${match[1]}.pdf`, root),
          );
          if (createHash("sha256").update(bytes).digest("hex") !== match[1])
            throw Error("Local PDF integrity mismatch");
          response.setHeader("Content-Type", "application/pdf");
          response.setHeader("Content-Length", bytes.length);
          response.setHeader(
            "Cache-Control",
            "private, max-age=31536000, immutable",
          );
          response.setHeader("X-Content-Type-Options", "nosniff");
          response.end(request.method === "HEAD" ? undefined : bytes);
        } catch {
          response.statusCode = 404;
          response.end();
        }
      });
    },
  };
}
