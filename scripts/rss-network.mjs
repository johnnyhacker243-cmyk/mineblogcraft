import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
export const privateIP = (ip) => {
  if (isIP(ip) === 6)
    return (
      /^(::|fc|fd|fe[89ab])/i.test(ip) || ip.toLowerCase().startsWith("::ffff:")
    );
  const a = ip.split(".").map(Number);
  return (
    a[0] === 0 ||
    a[0] === 10 ||
    a[0] === 127 ||
    a[0] >= 224 ||
    (a[0] === 169 && a[1] === 254) ||
    (a[0] === 172 && a[1] >= 16 && a[1] <= 31) ||
    (a[0] === 192 && a[1] === 168) ||
    (a[0] === 100 && a[1] >= 64 && a[1] <= 127)
  );
};
export async function fetchPublic(url, signal, allowlist) {
  for (let redirect = 0; redirect <= 4; redirect++) {
    const u = new URL(url);
    if (
      u.protocol !== "https:" ||
      u.username ||
      u.password ||
      (u.port && u.port !== "443") ||
      !allowlist.includes(u.hostname)
    )
      throw Error("URL_ALLOWLIST: disallowed host");
    const records = await lookup(u.hostname, { all: true });
    if (!records.length || records.some((r) => privateIP(r.address)))
      throw Error("URL_PRIVATE: private address");
    const r = await fetch(u, {
      signal,
      redirect: "manual",
      headers: {
        "User-Agent": "Mineblogcraft RSS reader/1.0",
        Accept:
          "application/rss+xml,application/atom+xml,application/xml,text/xml",
      },
    });
    if ([301, 302, 303, 307, 308].includes(r.status)) {
      await r.body?.cancel();
      url = new URL(r.headers.get("location"), u).href;
      continue;
    }
    if (!r.ok) throw Error("HTTP_" + r.status);
    const declared = Number(r.headers.get("content-length"));
    if (declared > 8_000_000) {
      await r.body?.cancel();
      throw Error("SIZE_LIMIT");
    }
    const reader = r.body.getReader();
    let bytes = 0;
    const chunks = [];
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 8_000_000) {
        await reader.cancel();
        throw Error("SIZE_LIMIT");
      }
      chunks.push(value);
    }
    const buffer = Buffer.concat(chunks);
    const encoding =
      r.headers.get("content-type")?.match(/charset=["']?([\w-]+)/i)?.[1] ||
      buffer
        .subarray(0, 160)
        .toString()
        .match(/encoding=["']([^"']+)/i)?.[1] ||
      "utf-8";
    return new TextDecoder(encoding).decode(buffer);
  }
  throw Error("REDIRECT_LIMIT");
}
