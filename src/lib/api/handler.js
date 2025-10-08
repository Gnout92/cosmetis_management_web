export async function normalizeBody(req) {
  if (req.body && typeof req.body === "object") return req.body; // Next đã parse OK

  // Nếu body là string -> thử parse JSON
  if (typeof req.body === "string" && req.body.trim()) {
    try { return JSON.parse(req.body); } catch (_) {}
  }

  // Nếu Content-Type: application/x-www-form-urlencoded
  if (req.headers["content-type"]?.includes("application/x-www-form-urlencoded") && typeof req.body === "string") {
    const params = new URLSearchParams(req.body);
    return Object.fromEntries(params.entries());
  }

  // Nếu không có gì, thử đọc raw
  if (!req.body) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const raw = Buffer.concat(chunks).toString("utf8");
    if (raw) {
      try { return JSON.parse(raw); } catch (_) {
        const p = new URLSearchParams(raw);
        if ([...p.keys()].length) return Object.fromEntries(p.entries());
      }
    }
  }
  return {};
}

export function createHandler(map) {
  return async function handler(req, res) {
    const fn = map[req.method];
    if (!fn) {
      res.setHeader("Allow", Object.keys(map));
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    try {
      // gắn req.parsedBody để các route dùng
      if (["POST", "PUT", "PATCH"].includes(req.method)) {
        req.parsedBody = await normalizeBody(req);
      }
      return await fn(req, res);
    } catch (err) {
      console.error(`[API ${req.url}]`, err);
      return res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  };
}
