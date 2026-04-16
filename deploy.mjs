import { createHash } from "crypto";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative } from "path";

const TOKEN   = "vcp_2UfM8uGJ9XkLYtJHeNGr1Af1SuummCKH7VnC70FVYtzGM7aCFV207sYy";
const TEAM    = "team_8JMeZ1Ho16eFhD1NCefwQkna";
const PROJECT = "prj_5HiwVSNE8I2IqKt34Obv1mZzXuKq";
const HEADERS = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

const EXCLUDE = new Set(["node_modules", "dist", ".git", ".vercel", "server", "deploy.mjs", "README.md"]);

function walk(dir, base = dir) {
  const results = [];
  for (const f of readdirSync(dir)) {
    if (EXCLUDE.has(f)) continue;
    const full = join(dir, f);
    if (statSync(full).isDirectory()) results.push(...walk(full, base));
    else results.push({ full, rel: relative(base, full) });
  }
  return results;
}

async function uploadFile(content) {
  const sha = createHash("sha1").update(content).digest("hex");
  await fetch(`https://api.vercel.com/v2/files?teamId=${TEAM}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "x-vercel-digest": sha, "Content-Type": "application/octet-stream" },
    body: content,
  });
  return { sha, size: content.length };
}

async function deploy() {
  const srcFiles = walk(".");
  const files = [];

  process.stdout.write(`Uploading ${srcFiles.length} source files...\n`);
  for (const { full, rel } of srcFiles) {
    const content = readFileSync(full);
    const { sha, size } = await uploadFile(content);
    files.push({ file: rel, sha, size });
  }

  process.stdout.write(`\nCreating deployment...\n`);
  const res = await fetch(`https://api.vercel.com/v13/deployments?teamId=${TEAM}&forceNew=1`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      name: "web_agency_dashboard",
      files,
      target: "production",
      projectSettings: {
        framework: "vite",
        buildCommand: "npm run build",
        outputDirectory: "dist",
        installCommand: "npm install",
      },
    }),
  });

  const data = await res.json();
  if (data.url) {
    process.stdout.write(`\nDeploying: https://${data.url}\nState: ${data.readyState}\n`);
    // Poll until ready
    let state = data.readyState;
    const uid = data.id;
    while (state === "INITIALIZING" || state === "BUILDING" || state === "DEPLOYING") {
      await new Promise(r => setTimeout(r, 5000));
      const check = await fetch(`https://api.vercel.com/v3/deployments/${uid}?teamId=${TEAM}`, { headers: HEADERS });
      const d = await check.json();
      state = d.readyState || d.state;
      process.stdout.write(`  ${state}...\n`);
    }
    process.stdout.write(`\nFinal state: ${state}\nURL: https://webagencydashboard.vercel.app\n`);
  } else {
    console.error("Error:", JSON.stringify(data.error || data, null, 2));
  }
}

deploy().catch(console.error);
