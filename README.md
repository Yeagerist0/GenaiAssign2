# AI Agent CLI Tool

Conversational terminal agent that follows a strict loop:
`START -> THINK -> TOOL -> OBSERVE -> OUTPUT`

It generates a Scaler-inspired website in separate files:
- `generated/scaler_clone/index.html`
- `generated/scaler_clone/style.css`
- `generated/scaler_clone/script.js`

## Setup

```bash
npm install
cp .env.example .env
```

Use one key:

```env
GROQ_API_KEY=your_gsk_key
# or
GEMINI_API_KEY=your_gemini_key
```

Optional model override:

```env
LLM_MODEL=llama-3.3-70b-versatile
```

## Run

Interactive:

```bash
npm start
```

One-shot:

```bash
npm run generate
```

## Example prompt

`Clone Scaler Academy landing page with header, hero and footer.`

