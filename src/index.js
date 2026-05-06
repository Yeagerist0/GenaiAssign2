import "dotenv/config";
import { OpenAI } from "openai";
import path from "node:path";
import process from "node:process";
import { promises as fs } from "node:fs";
import { execSync } from "node:child_process";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, "generated", "scaler_clone");

const DEFAULT_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Scaler Inspired Landing Page</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <header class="header">
    <div class="container nav">
      <a class="logo" href="#">scaler</a>
      <nav class="links" id="links">
        <a href="#">Programs</a>
        <a href="#">Success Stories</a>
        <a href="#">Mentors</a>
        <a href="#">Curriculum</a>
      </nav>
      <button class="cta">Apply Now</button>
      <button class="menu" id="menuBtn">☰</button>
    </div>
  </header>

  <section class="hero">
    <div class="container hero-grid">
      <div>
        <p class="tag">India's leading tech career accelerator</p>
        <h1>Build a high-growth tech career with <span>Scaler</span></h1>
        <p class="subtitle">Learn from top engineers, practice on real projects, and become interview-ready with structured mentorship.</p>
        <div class="actions">
          <button class="cta big">Book Free Session</button>
          <button class="ghost big">View Curriculum</button>
        </div>
      </div>
      <div class="card">
        <h3>Outcomes that matter</h3>
        <ul>
          <li>Comprehensive DSA + System Design</li>
          <li>1:1 mentor guidance</li>
          <li>Hiring support with top companies</li>
        </ul>
        <div class="stats">
          <div><strong>450K+</strong><span>Learners</span></div>
          <div><strong>900+</strong><span>Hiring partners</span></div>
          <div><strong>1500+</strong><span>Mentors</span></div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container foot-grid">
      <div>
        <h4>Scaler</h4>
        <p>Intensive software engineering programs built for real career outcomes.</p>
      </div>
      <div>
        <h5>Programs</h5>
        <a href="#">Academy</a>
        <a href="#">Data Science</a>
        <a href="#">DevOps</a>
      </div>
      <div>
        <h5>Company</h5>
        <a href="#">About</a>
        <a href="#">Blog</a>
        <a href="#">Contact</a>
      </div>
    </div>
  </footer>

  <script src="./script.js"></script>
</body>
</html>`;

const DEFAULT_CSS = `:root{
  --bg:#f8fbff;
  --ink:#0f172a;
  --muted:#475569;
  --brand:#0b1f5f;
  --accent:#ff7a00;
  --white:#fff;
  --line:#dce3f2;
}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--ink)}
.container{width:min(1120px,92%);margin:0 auto}
.header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.nav{min-height:72px;display:flex;align-items:center;gap:20px}
.logo{text-decoration:none;color:var(--brand);font-weight:800;font-size:1.55rem}
.links{display:flex;gap:22px;margin-left:auto}
.links a,.footer a{color:var(--muted);text-decoration:none;font-weight:500}
.links a:hover,.footer a:hover{color:var(--brand)}
.cta,.ghost{border:0;border-radius:12px;padding:10px 16px;font-weight:700;cursor:pointer}
.cta{background:var(--accent);color:var(--white)}
.cta:hover{filter:brightness(.95)}
.ghost{background:#fff;border:1px solid var(--line)}
.menu{display:none;background:#fff;border:1px solid var(--line);border-radius:10px;padding:7px 10px}
.hero{padding:72px 0;background:linear-gradient(180deg,#eef4ff 0%,#f8fbff 55%)}
.hero-grid{display:grid;grid-template-columns:1.15fr 1fr;gap:28px;align-items:center}
.tag{display:inline-block;background:#e4ecff;color:var(--brand);font-weight:600;padding:8px 12px;border-radius:999px}
h1{font-size:clamp(2rem,4vw,3.4rem);line-height:1.1;margin:14px 0}
h1 span{color:var(--accent)}
.subtitle{font-size:1.05rem;color:var(--muted);max-width:58ch}
.actions{display:flex;gap:12px;margin-top:20px;flex-wrap:wrap}
.big{padding:12px 18px}
.card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:24px;box-shadow:0 16px 35px rgba(15,23,42,.08)}
.card h3{margin:0 0 10px;color:var(--brand)}
.card ul{margin:0;padding-left:20px}
.card li{margin-bottom:8px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}
.stats div{background:#f7faff;border:1px solid var(--line);border-radius:12px;padding:10px}
.stats strong{display:block;color:var(--brand)}
.stats span{font-size:.84rem;color:var(--muted)}
.footer{margin-top:28px;background:var(--brand);color:#c7d4ff;padding:42px 0}
.foot-grid{display:grid;grid-template-columns:1.7fr 1fr 1fr;gap:20px}
.footer h4,.footer h5{color:#fff;margin:0 0 10px}
.footer a{display:block;margin-bottom:7px;color:#c7d4ff}
@media (max-width:920px){
  .hero-grid,.foot-grid{grid-template-columns:1fr}
  .links,.nav .cta{display:none}
  .menu{display:inline-block;margin-left:auto}
  .links.open{display:flex;position:absolute;top:72px;left:4%;right:4%;background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px;flex-direction:column}
}
`;

const DEFAULT_JS = `const menuBtn=document.getElementById("menuBtn");
const links=document.getElementById("links");
if(menuBtn&&links){
  menuBtn.addEventListener("click",()=>links.classList.toggle("open"));
}`;

const SYSTEM_PROMPT = `You are an autonomous AI coding agent.
You MUST always respond with ONE valid JSON object:
{
  "step":"START | THINK | TOOL | OUTPUT",
  "content":"string",
  "tool_name":"writeFile | executeCommand |",
  "tool_args":{}
}

Rules:
1) Work in sequence: START -> THINK -> TOOL -> THINK -> TOOL ... -> OUTPUT
2) Never skip directly to OUTPUT.
3) Create exactly these files:
   - generated/scaler_clone/index.html
   - generated/scaler_clone/style.css
   - generated/scaler_clone/script.js
4) Website must have Header, Hero Section, Footer, responsive design, and Scaler-like dark blue + orange theme.
5) Use TOOL for every file creation.
6) Only output JSON, no markdown.
`;

function parseJSONSafe(text) {
  const clean = text.trim().replace(/^```json\s*/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

function isWeak(pathValue, content) {
  if (!content || content.length < 60) return true;
  if (pathValue.endsWith("index.html")) {
    const text = content.toLowerCase();
    return (
      content.length < 1400 ||
      !text.includes("<!doctype html") ||
      !text.includes("class=\"hero\"") ||
      !text.includes("class=\"header\"") ||
      !text.includes("class=\"footer\"")
    );
  }
  if (pathValue.endsWith("style.css")) {
    const text = content.toLowerCase();
    return content.length < 1800 || !text.includes(":root") || !text.includes("@media") || !text.includes("--accent");
  }
  if (pathValue.endsWith("script.js")) return content.length < 100 || !content.includes("addEventListener");
  return false;
}

async function writeFileTool({ path: relPath = "", content = "" }) {
  const incomingPath = relPath || "";
  const normalizedInput = incomingPath.replace(/\\/g, "/");
  const normalized = normalizedInput.includes("/")
    ? normalizedInput
    : `generated/scaler_clone/${normalizedInput}`;
  const allowedPrefix = "generated/scaler_clone/";
  if (!normalized.startsWith(allowedPrefix)) {
    throw new Error(`Path must start with ${allowedPrefix}`);
  }
  const absPath = path.join(ROOT_DIR, normalized);
  await fs.mkdir(path.dirname(absPath), { recursive: true });

  let finalContent = content;
  if (isWeak(normalized, content)) {
    if (normalized.endsWith("index.html")) finalContent = DEFAULT_HTML;
    if (normalized.endsWith("style.css")) finalContent = DEFAULT_CSS;
    if (normalized.endsWith("script.js")) finalContent = DEFAULT_JS;
  }
  await fs.writeFile(absPath, finalContent, "utf8");
  return `Wrote ${normalized}`;
}

function executeCommandTool({ cmd = "" }) {
  if (!cmd.trim()) throw new Error("cmd is required");
  const output = execSync(cmd, { encoding: "utf8", stdio: "pipe", timeout: 12000 });
  return output.trim() || "Command executed";
}

function resolveClient() {
  if (process.env.GEMINI_API_KEY) {
    return {
      provider: "gemini",
      model: process.env.LLM_MODEL || "gemini-2.0-flash",
      client: new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
      })
    };
  }
  if (process.env.GROQ_API_KEY) {
    return {
      provider: "groq",
      model: process.env.LLM_MODEL || "llama-3.3-70b-versatile",
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1"
      })
    };
  }
  throw new Error("Set GEMINI_API_KEY or GROQ_API_KEY in .env");
}

function color(step) {
  if (step === "START") return "\x1b[35m";
  if (step === "THINK") return "\x1b[33m";
  if (step === "TOOL") return "\x1b[34m";
  if (step === "OUTPUT") return "\x1b[32m";
  return "\x1b[37m";
}

async function runAgentLoop(userRequest, llm) {
  const tools = { writeFile: writeFileTool, executeCommand: executeCommandTool };
  const requiredFiles = [
    "generated/scaler_clone/index.html",
    "generated/scaler_clone/style.css",
    "generated/scaler_clone/script.js"
  ];
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userRequest }
  ];

  for (let i = 0; i < 28; i += 1) {
    const response = await llm.client.chat.completions.create({
      model: llm.model,
      messages,
      temperature: 0.2
    });

    const raw = response.choices[0]?.message?.content || "";
    const action = parseJSONSafe(raw);
    if (!action) {
      messages.push({ role: "developer", content: "Invalid JSON. Return one valid JSON object only." });
      continue;
    }

    messages.push({ role: "assistant", content: JSON.stringify(action) });
    console.log(`${color(action.step)}[${action.step}]\x1b[0m ${action.content}`);

    if (action.step === "OUTPUT") {
      const missing = [];
      for (const f of requiredFiles) {
        try {
          await fs.access(path.join(ROOT_DIR, f));
        } catch {
          missing.push(f);
        }
      }
      if (missing.length === 0) return;
      messages.push({
        role: "developer",
        content: `OUTPUT is premature. Missing files: ${missing.join(", ")}. Continue with TOOL steps.`
      });
      continue;
    }
    if (action.step !== "TOOL") {
      messages.push({ role: "developer", content: "Proceed to next step with TOOL or OUTPUT when done." });
      continue;
    }

    try {
      const toolName = action.tool_name;
      const toolFn = tools[toolName];
      if (!toolFn) throw new Error(`Unknown tool: ${toolName}`);
      const toolArgs = action.tool_args || {};
      if (toolName === "writeFile") {
        const pathValue = toolArgs.path || toolArgs.file_path || toolArgs.filePath || toolArgs.filename || "";
        const contentValue = toolArgs.content || toolArgs.file_content || toolArgs.code || "";
        const result = await toolFn({ path: pathValue, content: contentValue });
        messages.push({ role: "developer", content: JSON.stringify({ step: "OBSERVE", result }) });
        console.log(`\x1b[90m  > ${result}\x1b[0m`);
        continue;
      }
      const result = await toolFn(toolArgs);
      messages.push({ role: "developer", content: JSON.stringify({ step: "OBSERVE", result }) });
      console.log(`\x1b[90m  > ${result}\x1b[0m`);
    } catch (error) {
      const result = `Tool failed: ${error.message}`;
      messages.push({ role: "developer", content: JSON.stringify({ step: "OBSERVE", result }) });
      console.log(`\x1b[31m  > ${result}\x1b[0m`);
    }
  }
  console.log("\x1b[31mStep limit reached before OUTPUT.\x1b[0m");
}

function getGeneratePrompt() {
  const idx = process.argv.findIndex((x) => x === "--generate");
  return idx === -1 ? "" : process.argv[idx + 1] || "";
}

async function interactiveMode(llm) {
  const rl = readline.createInterface({ input, output });
  console.log(`Using provider: ${llm.provider}, model: ${llm.model}`);
  console.log("Type 'exit' to quit.\n");
  while (true) {
    const q = await rl.question("You: ");
    if (!q) continue;
    if (q.trim().toLowerCase() === "exit") break;
    await runAgentLoop(q, llm);
  }
  rl.close();
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const llm = resolveClient();
  const prompt = getGeneratePrompt();
  if (prompt) {
    console.log(`Using provider: ${llm.provider}, model: ${llm.model}`);
    await runAgentLoop(prompt, llm);
    return;
  }
  await interactiveMode(llm);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
