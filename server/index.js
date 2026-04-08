import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import http from "node:http";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const serverFile = fileURLToPath(import.meta.url);
const serverDirectory = resolve(serverFile, "..");
const projectRoot = resolve(serverDirectory, "..");
const dataDirectory = join(projectRoot, "data");
const databasePath = join(dataDirectory, "app.db");
const distDirectory = join(projectRoot, "dist");
const port = Number.parseInt(process.env.PORT || "4000", 10);

mkdirSync(dataDirectory, { recursive: true });

const database = new DatabaseSync(databasePath);

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const createUserStatement = database.prepare(`
  INSERT INTO users (name, email, password_hash, created_at)
  VALUES (?, ?, ?, ?)
`);
const findUserByEmailStatement = database.prepare(`
  SELECT id, name, email, password_hash, created_at
  FROM users
  WHERE email = ?
`);
const findUserByIdStatement = database.prepare(`
  SELECT id, name, email, created_at
  FROM users
  WHERE id = ?
`);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derived = scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, "hex");

  if (derived.length !== stored.length) {
    return false;
  }

  return timingSafeEqual(derived, stored);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
  };
}

function parseJsonBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    const chunks = [];

    request.on("data", (chunk) => {
      chunks.push(chunk);
    });

    request.on("end", () => {
      if (!chunks.length) {
        resolveBody({});
        return;
      }

      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString("utf-8")));
      } catch {
        rejectBody(new Error("Invalid JSON payload."));
      }
    });

    request.on("error", rejectBody);
  });
}

function serveStaticAsset(response, pathname) {
  if (!existsSync(distDirectory)) {
    sendJson(response, 404, {
      message: "Frontend build not found. Run `npm run build` or use `npm run dev:client` for development.",
    });
    return;
  }

  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  let filePath = resolve(distDirectory, relativePath);

  if (!filePath.startsWith(distDirectory)) {
    sendJson(response, 403, { message: "Forbidden path." });
    return;
  }

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(distDirectory, "index.html");
  }

  if (!existsSync(filePath)) {
    sendJson(response, 404, { message: "File not found." });
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const pathname = url.pathname;

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    });
    response.end();
    return;
  }

  if (request.method === "GET" && pathname === "/api/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (request.method === "POST" && pathname === "/api/auth/signup") {
    try {
      const body = await parseJsonBody(request);
      const name = String(body.name || "").trim();
      const email = normalizeEmail(body.email);
      const password = String(body.password || "");

      if (!name || !email || !password) {
        sendJson(response, 400, { message: "Name, email, and password are required." });
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        sendJson(response, 400, { message: "Please provide a valid email address." });
        return;
      }

      if (password.length < 6) {
        sendJson(response, 400, { message: "Password must be at least 6 characters long." });
        return;
      }

      const existingUser = findUserByEmailStatement.get(email);

      if (existingUser) {
        sendJson(response, 409, { message: "An account already exists for this email address." });
        return;
      }

      const result = createUserStatement.run(name, email, hashPassword(password), new Date().toISOString());
      const user = findUserByIdStatement.get(Number(result.lastInsertRowid));

      sendJson(response, 201, {
        message: "Account created successfully.",
        user: sanitizeUser(user),
      });
    } catch (error) {
      sendJson(response, 400, { message: error.message || "Signup failed." });
    }
    return;
  }

  if (request.method === "POST" && pathname === "/api/auth/login") {
    try {
      const body = await parseJsonBody(request);
      const email = normalizeEmail(body.email);
      const password = String(body.password || "");

      if (!email || !password) {
        sendJson(response, 400, { message: "Email and password are required." });
        return;
      }

      const user = findUserByEmailStatement.get(email);

      if (!user || !verifyPassword(password, user.password_hash)) {
        sendJson(response, 401, { message: "Invalid email or password." });
        return;
      }

      sendJson(response, 200, {
        message: "Login successful.",
        user: sanitizeUser(user),
      });
    } catch (error) {
      sendJson(response, 400, { message: error.message || "Login failed." });
    }
    return;
  }

  if (pathname.startsWith("/api/")) {
    sendJson(response, 404, { message: "Route not found." });
    return;
  }

  serveStaticAsset(response, pathname);
});

server.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
  console.log(`SQLite database ready at ${databasePath}`);
});
