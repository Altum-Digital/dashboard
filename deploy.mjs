import { createHash } from "crypto";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { execSync } from "child_process";

const VERCEL_TOKEN = "vcp_2UfM8uGJ9XkLYtJHeNGr1Af1SuummCKH7VnC70FVYtzGM7aCFV207sYy";
const TEAM         = "team_8JMeZ1Ho16eFhD1NCefwQkna";
const PROJECT      = "prj_5HiwVSNE8I2IqKt34Obv1mZzXuKq";
const VHEADERS     = { Authorization: `Bearer ${VERCEL_TOKEN}`, "Content-Type": "application/json" };

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
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, "x-vercel-digest": sha, "Content-Type": "application/octet-stream" },
    body: content,
  });
  return { sha, size: content.length };
}

async function refreshGhToken() {
  // Get the current gh CLI token and update it in Vercel so it never expires
  const ghToken = execSync("gh auth token", { encoding: "utf8" }).trim();

  // Find and update the GH_TOKEN env var
  const listRes = await fetch(`https://api.vercel.com/v9/projects/${PROJECT}/env?teamId=${TEAM}`, { headers: VHEADERS });
  const { envs } = await listRes.json();
  const existing = envs?.find(e => e.key === "GH_TOKEN");

  if (existing) {
    await fetch(`https://api.vercel.com/v9/projects/${PROJECT}/env/${existing.id}?teamId=${TEAM}`, {
      method: "PATCH",
      headers: VHEADERS,
      body: JSON.stringify({ value: ghToken }),
    });
    process.stdout.write(`Token refreshed.\n`);
  } else {
    await fetch(`https://api.vercel.com/v10/projects/${PROJECT}/env?teamId=${TEAM}`, {
      method: "POST",
      headers: VHEADERS,
      body: JSON.stringify({ key: "GH_TOKEN", value: ghToken, type: "encrypted", target: ["production", "preview", "development"] }),
    });
    process.stdout.write(`Token created.\n`);
  }

  return ghToken;
}

async function deploy() {
  process.stdout.write("Refreshing GitHub token...\n");
  await refreshGhToken();

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
    headers: VHEADERS,
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
    let state = data.readyState;
    const uid = data.id;
    while (state === "INITIALIZING" || state === "BUILDING" || state === "DEPLOYING") {
      await new Promise(r => setTimeout(r, 5000));
      const check = await fetch(`https://api.vercel.com/v3/deployments/${uid}?teamId=${TEAM}`, { headers: VHEADERS });
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
