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

3. Put your OpenAI key in `.env`:

```env
OPENAI_API_KEY=your_key_here
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

