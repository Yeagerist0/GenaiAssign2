# Assignment 02 — AI Agent CLI Tool

A conversational CLI agent that accepts natural language instructions in terminal, reasons step-by-step (START/THINK/TOOL/OBSERVE/OUTPUT style), and generates a Scaler Academy inspired website clone using HTML, CSS, and JavaScript.

## Features

- Conversational terminal interface
- Multi-step reasoning loop (not single-shot generation)
- Tool-driven file generation (`index.html`, `styles.css`, `script.js`)
- Includes required sections:
  - Header
  - Hero Section
  - Footer
- Browser-open helper tool
- Output saved under `output/`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add environment file:

```bash
cp .env.example .env
```

3. Put your API key in `.env`:

```env
GEMINI_API_KEY=your_gemini_key_here
NVIDIA_API_KEY=your_nvapi_key_here
GROQ_API_KEY=your_groq_key_here
GROK_API_KEY=your_key_here
```

Optional fallback:

```env
OPENAI_API_KEY=your_openai_key_here
```

Optional model override:

```env
LLM_MODEL=gemini-2.0-flash
LLM_MODEL=meta/llama-3.1-70b-instruct
LLM_MODEL=llama-3.3-70b-versatile
LLM_MODEL=grok-3-mini
```

## Run

### Interactive mode (chat in terminal)

```bash
npm start
```

### One-shot generation

```bash
npm run generate
```

## Example Instruction

`Clone Scaler Academy website with modern header, hero section and footer. Keep it responsive and visually close to Scaler.`

## Expected Output

Generated files are created inside:

`output/<project-name>-<timestamp>/`

- `index.html`
- `styles.css`
- `script.js`

Open `index.html` in browser to view the final clone.
