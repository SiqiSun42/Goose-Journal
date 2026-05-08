export const SAMPLE_TEXT =
  "I made an error at work, so I'm an idiot. I'm careless. I'm incompetent. That's just who I am - someone who can't do anything right. Everyone at work knows I'm unreliable. I'm the kind of person who always messes things up. I was born this way and I'll always be this way.";

export const ui = {
  docTitle: "Goose · Response lab",
  eyebrow: "HCI Studio · Test page",
  title: "The Goose replies",
  lede:
    "Type some text, select a phrase and tap the goose—or skip selection to send the whole passage. After a reply appears, you can save or regenerate.",
  inputLabel: "Input",
  gooseAria: "Ask the goose about the selection or full text",
  loading: "The goose is thinking…",
  emptyPrompt:
    "Add some text first—or select a phrase in the box, then tap the goose.",
  errorNetwork: "Something went wrong. Try again in a moment.",
  savedTitle: "Saved",
  savedEmpty: "Nothing saved yet. Tap Save when you like a reply.",
  save: "Save",
  regenerate: "Regenerate",
  pillSelection: "Selection",
  pillFull: "Full text",
  providerLabel: "Model source",
  providerMock: "Mock",
  providerOllama: "Ollama (local)",
  providerGroq: "Groq (cloud)",
  modelNameLabel: "Model (optional)",
  hintOllama:
    "Keep Ollama running locally. Name must match `ollama list`; blank uses env or gemma3:latest. After `ollama create goose`, use model name goose.",
  hintGroq:
    "Put GROQ_API_KEY in `.env.local` from https://console.groq.com/keys — restart `npm run dev` after editing. Model IDs: Groq console → Models.",
} as const;
