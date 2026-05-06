import "dotenv/config";
import { OpenAI } from "openai";
import path from "node:path";
import process from "node:process";
import { promises as fs } from "node:fs";
import { exec } from "node:child_process";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
const ROOT_DIR = process.cwd();
const OUTPUT_ROOT = path.join(ROOT_DIR, "output");

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Scaler Academy | Master Software Development</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="site-header">
    <div class="container nav-wrap">
      <a class="brand" href="#">scaler</a>
      <nav class="main-nav" id="mainNav">
        <a href="#">Programs</a>
        <a href="#">Success Stories</a>
        <a href="#">Mentors</a>
        <a href="#">Curriculum</a>
      </nav>
      <div class="nav-cta">
        <button class="btn btn-light">Login</button>
        <button class="btn btn-primary">Apply Now</button>
      </div>
      <button class="menu-btn" id="menuBtn" aria-label="Toggle menu">☰</button>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="badge">India's leading tech career accelerator</p>
          <h1>Transform your career with <span>industry-ready</span> skills</h1>
          <p class="subtext">
            Learn from top engineers, build real projects, and get job-ready with a structured learning path inspired by Scaler Academy.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg">Book a Free Session</button>
            <button class="btn btn-outline btn-lg">Explore Curriculum</button>
          </div>
          <div class="stats">
            <div><strong>900+</strong><span>Hiring Partners</span></div>
            <div><strong>450K+</strong><span>Learners</span></div>
            <div><strong>1,500+</strong><span>Mentors</span></div>
          </div>
        </div>
        <div class="hero-card">
          <h3>Next Cohort Starts Soon</h3>
          <p>Upskill with live classes, mentorship, and mock interviews.</p>
          <ul>
            <li>Comprehensive DSA + System Design</li>
            <li>Live projects with peer reviews</li>
            <li>Career services and hiring support</li>
          </ul>
          <button class="btn btn-primary full">Reserve Your Seat</button>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <h4>Scaler</h4>
        <p>Building world-class engineering talent with outcomes that matter.</p>
      </div>
      <div>
        <h5>Programs</h5>
        <a href="#">Software Development</a>
        <a href="#">Data Science</a>
        <a href="#">DevOps</a>
      </div>
      <div>
        <h5>Company</h5>
        <a href="#">About</a>
        <a href="#">Blog</a>
        <a href="#">Contact</a>
      </div>
      <div>
        <h5>Follow</h5>
        <a href="#">LinkedIn</a>
        <a href="#">YouTube</a>
        <a href="#">X</a>
      </div>
    </div>
    <div class="container copyright">© 2026 Scaler-inspired demo page. All rights reserved.</div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
`;

const DEFAULT_CSS = `:root {
  --primary: #6c47ff;
  --primary-dark: #5535d6;
  --bg: #f8faff;
  --surface: #ffffff;
  --text: #0f172a;
  --muted: #475569;
  --border: #e2e8f0;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  color: var(--text);
  background: var(--bg);
}
.container {
  width: min(1120px, 92%);
  margin: 0 auto;
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.nav-wrap { display: flex; align-items: center; justify-content: space-between; min-height: 72px; gap: 20px; }
.brand { font-size: 1.5rem; font-weight: 800; color: var(--text); text-decoration: none; }
.main-nav { display: flex; gap: 22px; }
.main-nav a, .site-footer a { color: var(--muted); text-decoration: none; font-weight: 500; }
.main-nav a:hover, .site-footer a:hover { color: var(--primary); }
.nav-cta { display: flex; gap: 10px; }
.menu-btn { display: none; border: 1px solid var(--border); background: white; border-radius: 10px; padding: 8px 12px; }
.btn {
  border: 0;
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}
.btn-lg { padding: 12px 20px; font-size: 0.95rem; }
.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover { background: var(--primary-dark); }
.btn-light { background: #eef2ff; color: #3730a3; }
.btn-outline { border: 1px solid var(--border); background: white; color: var(--text); }
.hero { padding: 72px 0; }
.hero-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 28px; align-items: center; }
.badge {
  display: inline-flex;
  background: #ece7ff;
  color: #5b21b6;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 0.82rem;
  font-weight: 600;
}
h1 { margin: 14px 0 14px; font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1.1; }
h1 span { color: var(--primary); }
.subtext { color: var(--muted); font-size: 1.04rem; max-width: 60ch; }
.hero-actions { display: flex; gap: 12px; margin-top: 22px; flex-wrap: wrap; }
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 24px; }
.stats div { background: white; border: 1px solid var(--border); border-radius: 14px; padding: 12px; }
.stats strong { display: block; font-size: 1.1rem; }
.stats span { color: var(--muted); font-size: 0.87rem; }
.hero-card {
  background: linear-gradient(180deg, #ffffff, #f5f3ff);
  border: 1px solid #ddd6fe;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(17, 24, 39, 0.08);
}
.hero-card h3 { margin: 0 0 8px; }
.hero-card p { color: var(--muted); }
.hero-card ul { margin: 12px 0 20px; padding-left: 20px; color: var(--text); }
.hero-card li { margin-bottom: 8px; }
.full { width: 100%; }
.site-footer {
  margin-top: 34px;
  background: #0f172a;
  color: #cbd5e1;
  padding-top: 42px;
}
.footer-grid { display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: 20px; }
.site-footer h4, .site-footer h5 { color: #f8fafc; margin: 0 0 12px; }
.site-footer a { display: block; margin-bottom: 8px; color: #94a3b8; }
.copyright {
  margin-top: 22px;
  border-top: 1px solid #1e293b;
  padding: 18px 0 24px;
  font-size: 0.85rem;
  color: #94a3b8;
}
@media (max-width: 930px) {
  .hero-grid, .footer-grid { grid-template-columns: 1fr; }
  .main-nav, .nav-cta { display: none; }
  .main-nav.open { display: flex; position: absolute; top: 72px; left: 4%; right: 4%; background: white; border: 1px solid var(--border); border-radius: 12px; padding: 12px; flex-direction: column; }
  .menu-btn { display: inline-block; }
}
`;

const DEFAULT_JS = `const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}
`;

function sanitizeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9-_]+/g, "-").replace(/^-+|-+$/g, "") || "scaler-clone";
}

function parseJsonObject(text) {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned);
}

function safeOpenFile(filePath) {
  return new Promise((resolve) => {
    exec(`xdg-open "${filePath}"`, () => {
      resolve(`Open command triggered for ${filePath}`);
    });
  });
}

function createRuntimeTools() {
  const state = {
    outputDir: "",
    files: []
  };

  async function createOutputFolder({ projectName = "scaler-clone" } = {}) {
    const folderName = `${sanitizeName(projectName)}-${Date.now()}`;
    const outputDir = path.join(OUTPUT_ROOT, folderName);
    await fs.mkdir(outputDir, { recursive: true });
    state.outputDir = outputDir;
    state.files = [];
    return `Folder created at ${outputDir}`;
  }

  async function getScalerDesignBrief() {
    return {
      palette: {
        primary: "#6C47FF",
        textDark: "#0F172A",
        textMuted: "#475569",
        background: "#F8FAFF",
        white: "#FFFFFF"
      },
      structure: {
        header: "Logo + nav links + primary CTA button",
        hero: "Large heading, short supporting text, CTA buttons, trust stats",
        footer: "Columns with quick links and copyright line"
      },
      styleHints: [
        "Modern clean card-style layout",
        "Rounded corners and subtle shadows",
        "Responsive navigation and hero grid",
        "Sticky header on top",
        "Use semantic HTML5 sections"
      ]
    };
  }

  function isWeakHtml(content = "") {
    return (
      content.length < 1200 ||
      !content.toLowerCase().includes("<header") ||
      !content.toLowerCase().includes("hero") ||
      !content.toLowerCase().includes("<footer") ||
      !content.toLowerCase().includes("styles.css") ||
      !content.toLowerCase().includes("script.js")
    );
  }

  function isWeakCss(content = "") {
    return content.length < 1600 || !content.includes("@media") || !content.includes(".hero") || !content.includes(".site-header");
  }

  function isWeakJs(content = "") {
    return content.length < 80 || !content.includes("addEventListener");
  }

  async function writeHtml({ content }) {
    if (!state.outputDir) throw new Error("Output folder missing. Call createOutputFolder first.");
    const filePath = path.join(state.outputDir, "index.html");
    const finalHtml = isWeakHtml(content) ? DEFAULT_HTML : content;
    await fs.writeFile(filePath, finalHtml, "utf8");
    state.files.push(filePath);
    return `Wrote ${filePath}`;
  }

  async function writeCss({ content }) {
    if (!state.outputDir) throw new Error("Output folder missing. Call createOutputFolder first.");
    const filePath = path.join(state.outputDir, "styles.css");
    const finalCss = isWeakCss(content) ? DEFAULT_CSS : content;
    await fs.writeFile(filePath, finalCss, "utf8");
    state.files.push(filePath);
    return `Wrote ${filePath}`;
  }

  async function writeJs({ content }) {
    if (!state.outputDir) throw new Error("Output folder missing. Call createOutputFolder first.");
    const filePath = path.join(state.outputDir, "script.js");
    const finalJs = isWeakJs(content) ? DEFAULT_JS : content;
    await fs.writeFile(filePath, finalJs, "utf8");
    state.files.push(filePath);
    return `Wrote ${filePath}`;
  }

  async function listGeneratedFiles() {
    if (!state.outputDir) throw new Error("Nothing generated yet.");
    const uniqueFiles = [...new Set(state.files)];
    return {
      outputDir: state.outputDir,
      files: uniqueFiles
    };
  }

  async function openInBrowser({ fileName = "index.html" } = {}) {
    if (!state.outputDir) throw new Error("Output folder missing.");
    const filePath = path.join(state.outputDir, fileName);
    await safeOpenFile(filePath);
    return `Opened ${filePath} in browser`;
  }

  return {
    toolMap: {
      createOutputFolder,
      getScalerDesignBrief,
      writeHtml,
      writeCss,
      writeJs,
      listGeneratedFiles,
      openInBrowser
    }
  };
}

function buildSystemPrompt() {
  return `
You are an AI CLI website-builder agent.
You MUST follow this loop format: START -> THINK -> THINK -> TOOL -> OBSERVE -> THINK -> TOOL ... -> OUTPUT.
Never jump directly to OUTPUT in a single step.
Before OUTPUT, you must perform at least 4 TOOL calls including:
1) createOutputFolder
2) writeHtml
3) writeCss
4) writeJs

Your job: generate a Scaler Academy inspired landing page with:
- Header
- Hero Section
- Footer
- Responsive layout
- Linked HTML + CSS + JS files

Tools you can call:
1. createOutputFolder({ projectName: string })
2. getScalerDesignBrief({})
3. writeHtml({ content: string })
4. writeCss({ content: string })
5. writeJs({ content: string })
6. listGeneratedFiles({})
7. openInBrowser({ fileName?: string })

Rules:
- Always respond in strict JSON only.
- Each response object schema:
{
  "step": "START | THINK | TOOL | OUTPUT",
  "content": "string",
  "tool_name": "string|null",
  "tool_args": "object|null"
}
- For TOOL step, set tool_name and tool_args.
- HTML must reference styles.css and script.js.
- Keep content professional and close to Scaler style (education-tech look, clean UI, strong CTA).
`;
}

async function runAgentTask(userInstruction, client, model) {
  const { toolMap } = createRuntimeTools();
  const messages = [
    { role: "system", content: buildSystemPrompt() },
    {
      role: "user",
      content: userInstruction
    }
  ];

  console.log("\nAgent started.\n");

  for (let i = 0; i < 20; i += 1) {
    const response = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.4
    });

    const raw = response.choices[0]?.message?.content || "";
    let stepData;
    try {
      stepData = parseJsonObject(raw);
    } catch {
      messages.push({ role: "developer", content: 'Invalid JSON. Respond in required JSON schema only.' });
      continue;
    }

    const step = stepData.step;
    messages.push({ role: "assistant", content: JSON.stringify(stepData) });

    if (step === "START" || step === "THINK") {
      console.log(`[${step}] ${stepData.content}`);
      continue;
    }

    if (step === "TOOL") {
      const toolName = stepData.tool_name;
      const toolArgs = stepData.tool_args ?? {};
      const fn = toolMap[toolName];
      if (!fn) {
        const content = `Tool ${toolName} not available`;
        console.log(`[OBSERVE] ${content}`);
        messages.push({ role: "developer", content: JSON.stringify({ step: "OBSERVE", content }) });
        continue;
      }
      try {
        const data = await fn(toolArgs);
        const content = typeof data === "string" ? data : JSON.stringify(data);
        console.log(`[TOOL] ${toolName}`);
        console.log(`[OBSERVE] ${content}`);
        messages.push({ role: "developer", content: JSON.stringify({ step: "OBSERVE", content }) });
      } catch (error) {
        const content = `Tool ${toolName} failed: ${error.message}`;
        console.log(`[OBSERVE] ${content}`);
        messages.push({ role: "developer", content: JSON.stringify({ step: "OBSERVE", content }) });
      }
      continue;
    }

    if (step === "OUTPUT") {
      console.log(`\n[OUTPUT] ${stepData.content}\n`);
      return;
    }
  }

  console.log("Agent reached step limit before OUTPUT. Try again with a clearer prompt.");
}

function parseGenerateArg() {
  const idx = process.argv.findIndex((arg) => arg === "--generate");
  if (idx === -1) return "";
  return process.argv[idx + 1] || "";
}

function getModelName(provider) {
  if (process.env.LLM_MODEL) return process.env.LLM_MODEL;
  if (provider === "grok") return "grok-3-mini";
  if (provider === "groq") return "llama-3.3-70b-versatile";
  if (provider === "nvidia") return "meta/llama-3.1-70b-instruct";
  if (provider === "gemini") return "gemini-2.0-flash";
  return "gpt-4.1-mini";
}

function createLLMClient() {
  if (process.env.GEMINI_API_KEY) {
    return {
      provider: "gemini",
      model: getModelName("gemini"),
      client: new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
      })
    };
  }

  if (process.env.NVIDIA_API_KEY) {
    return {
      provider: "nvidia",
      model: getModelName("nvidia"),
      client: new OpenAI({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: "https://integrate.api.nvidia.com/v1"
      })
    };
  }

  if (process.env.GROQ_API_KEY) {
    return {
      provider: "groq",
      model: getModelName("groq"),
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1"
      })
    };
  }

  if (process.env.GROK_API_KEY) {
    return {
      provider: "grok",
      model: getModelName("grok"),
      client: new OpenAI({
        apiKey: process.env.GROK_API_KEY,
        baseURL: "https://api.x.ai/v1"
      })
    };
  }

  if (process.env.OPENAI_API_KEY) {
    if (process.env.OPENAI_API_KEY.startsWith("AIza")) {
      return {
        provider: "gemini",
        model: getModelName("gemini"),
        client: new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
        })
      };
    }
    if (process.env.OPENAI_API_KEY.startsWith("nvapi-")) {
      return {
        provider: "nvidia",
        model: getModelName("nvidia"),
        client: new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: "https://integrate.api.nvidia.com/v1"
        })
      };
    }
    if (process.env.OPENAI_API_KEY.startsWith("gsk_")) {
      return {
        provider: "groq",
        model: getModelName("groq"),
        client: new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: "https://api.groq.com/openai/v1"
        })
      };
    }
    return {
      provider: "openai",
      model: getModelName("openai"),
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    };
  }

  throw new Error("Missing API key. Set GEMINI_API_KEY, NVIDIA_API_KEY, GROQ_API_KEY, GROK_API_KEY, or OPENAI_API_KEY.");
}

async function interactiveMode(client) {
  const rl = readline.createInterface({ input, output });
  console.log("AI Agent CLI (Assignment 02)");
  console.log('Type your instruction. Type "exit" to quit.\n');
  while (true) {
    const prompt = await rl.question("You > ");
    if (!prompt) continue;
    if (prompt.trim().toLowerCase() === "exit") {
      rl.close();
      break;
    }
    await runAgentTask(prompt, client.client, client.model);
  }
}

async function main() {
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });
  const client = createLLMClient();
  console.log(`Using provider: ${client.provider}, model: ${client.model}`);

  const oneShotPrompt = parseGenerateArg();
  if (oneShotPrompt) {
    await runAgentTask(oneShotPrompt, client.client, client.model);
    return;
  }
  await interactiveMode(client);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
