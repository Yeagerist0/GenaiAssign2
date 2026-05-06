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

  async function writeHtml({ content }) {
    if (!state.outputDir) throw new Error("Output folder missing. Call createOutputFolder first.");
    const filePath = path.join(state.outputDir, "index.html");
    await fs.writeFile(filePath, content, "utf8");
    state.files.push(filePath);
    return `Wrote ${filePath}`;
  }

  async function writeCss({ content }) {
    if (!state.outputDir) throw new Error("Output folder missing. Call createOutputFolder first.");
    const filePath = path.join(state.outputDir, "styles.css");
    await fs.writeFile(filePath, content, "utf8");
    state.files.push(filePath);
    return `Wrote ${filePath}`;
  }

  async function writeJs({ content }) {
    if (!state.outputDir) throw new Error("Output folder missing. Call createOutputFolder first.");
    const filePath = path.join(state.outputDir, "script.js");
    await fs.writeFile(filePath, content, "utf8");
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

async function runAgentTask(userInstruction, client) {
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
      model: "gpt-4.1-mini",
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
    await runAgentTask(prompt, client);
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY in environment.");
    process.exit(1);
  }
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const oneShotPrompt = parseGenerateArg();
  if (oneShotPrompt) {
    await runAgentTask(oneShotPrompt, client);
    return;
  }
  await interactiveMode(client);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
