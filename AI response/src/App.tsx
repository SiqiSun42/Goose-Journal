import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  askGoose,
  parseLlmProvider,
  type LlmProvider,
} from "./api";
import { SAMPLE_TEXT, ui } from "./i18n";

type GooseState =
  | { kind: "idle" }
  | { kind: "loading"; prompt: string; fromSelection: boolean }
  | { kind: "empty"; message: string }
  | {
      kind: "answer";
      prompt: string;
      reply: string;
      fromSelection: boolean;
    };

type SavedItem = {
  id: string;
  prompt: string;
  reply: string;
  fromSelection: boolean;
};

function readPromptFromTextarea(el: HTMLTextAreaElement): {
  prompt: string;
  fromSelection: boolean;
} {
  const v = el.value;
  const a = el.selectionStart;
  const b = el.selectionEnd;
  if (a !== b) {
    const slice = v.slice(a, b);
    return { prompt: slice, fromSelection: true };
  }
  return { prompt: v, fromSelection: false };
}

const LS_PROVIDER = "goose-llm-provider";
const LS_OLLAMA_MODEL = "goose-ollama-model";
const LS_GROQ_MODEL = "goose-groq-model";

function readInitialProvider(): LlmProvider {
  try {
    const s = localStorage.getItem(LS_PROVIDER);
    if (s) return parseLlmProvider(s);
  } catch {}
  return "groq";
}

function readStoredString(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

export default function App() {
  const labelId = useId();
  const providerSelectId = useId();
  const ollamaModelId = useId();
  const groqModelId = useId();
  const savedHeadingId = useId();
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(SAMPLE_TEXT);
  const [provider, setProvider] = useState<LlmProvider>(() =>
    readInitialProvider()
  );
  const [ollamaModel, setOllamaModel] = useState(() =>
    readStoredString(LS_OLLAMA_MODEL)
  );
  const [groqModel, setGroqModel] = useState(() =>
    readStoredString(LS_GROQ_MODEL)
  );
  const [goose, setGoose] = useState<GooseState>({ kind: "idle" });
  const [saved, setSaved] = useState<SavedItem[]>([]);

  useEffect(() => {
    document.documentElement.lang = "en";
    document.title = ui.docTitle;
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_PROVIDER, provider);
    } catch {}
  }, [provider]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_OLLAMA_MODEL, ollamaModel);
    } catch {}
  }, [ollamaModel]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_GROQ_MODEL, groqModel);
    } catch {}
  }, [groqModel]);

  const runAsk = useCallback(
    async (prompt: string, fromSelection: boolean) => {
      const trimmed = prompt.trim();
      if (!trimmed) {
        setGoose({
          kind: "empty",
          message: ui.emptyPrompt,
        });
        return;
      }
      setGoose({ kind: "loading", prompt: trimmed, fromSelection });
      try {
        const reply = await askGoose(trimmed, {
          provider,
          ollamaModel: ollamaModel.trim() || undefined,
          groqModel: groqModel.trim() || undefined,
        });
        setGoose({
          kind: "answer",
          prompt: trimmed,
          reply,
          fromSelection,
        });
      } catch (e) {
        const extra =
          e instanceof Error && e.message && e.message.length < 360
            ? e.message
            : "";
        setGoose({
          kind: "empty",
          message: extra
            ? `${ui.errorNetwork} (${extra})`
            : ui.errorNetwork,
        });
      }
    },
    [groqModel, ollamaModel, provider]
  );

  const onGooseClick = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    const { prompt, fromSelection } = readPromptFromTextarea(el);
    void runAsk(prompt, fromSelection);
  }, [runAsk]);

  const onRegenerate = useCallback(() => {
    if (goose.kind !== "answer") return;
    void runAsk(goose.prompt, goose.fromSelection);
  }, [goose, runAsk]);

  const onSave = useCallback(() => {
    if (goose.kind !== "answer") return;
    setSaved((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        prompt: goose.prompt,
        reply: goose.reply,
        fromSelection: goose.fromSelection,
      },
      ...prev,
    ]);
  }, [goose]);

  const showBubble =
    goose.kind === "loading" ||
    goose.kind === "empty" ||
    goose.kind === "answer";

  const bubbleText =
    goose.kind === "empty"
      ? goose.message
      : goose.kind === "answer"
        ? goose.reply
        : "";

  const showActions = goose.kind === "answer";

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">{ui.eyebrow}</p>
        <h1 className="title">{ui.title}</h1>
        <p className="lede">{ui.lede}</p>
      </header>

      <main className="shell">
        <div className="llm-panel">
          <div className="llm-row">
            <label className="label llm-field-label" htmlFor={providerSelectId}>
              {ui.providerLabel}
            </label>
            <select
              id={providerSelectId}
              className="select"
              value={provider}
              onChange={(e) =>
                setProvider(parseLlmProvider(e.target.value))
              }
            >
              <option value="mock">{ui.providerMock}</option>
              <option value="ollama">{ui.providerOllama}</option>
              <option value="groq">{ui.providerGroq}</option>
            </select>
          </div>
          {provider === "ollama" ? (
            <div className="llm-row llm-row--tight">
              <label className="label llm-field-label" htmlFor={ollamaModelId}>
                {ui.modelNameLabel}
              </label>
              <input
                id={ollamaModelId}
                className="text-input"
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                placeholder={
                  import.meta.env.VITE_OLLAMA_MODEL || "gemma3:latest"
                }
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          ) : null}
          {provider === "groq" ? (
            <div className="llm-row llm-row--tight">
              <label
                className="label llm-field-label"
                htmlFor={groqModelId}
              >
                {ui.modelNameLabel}
              </label>
              <input
                id={groqModelId}
                className="text-input"
                value={groqModel}
                onChange={(e) => setGroqModel(e.target.value)}
                placeholder={
                  import.meta.env.VITE_GROQ_MODEL || "llama-3.1-8b-instant"
                }
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          ) : null}
          {provider === "ollama" ? (
            <p className="llm-hint prose-flow">{ui.hintOllama}</p>
          ) : null}
          {provider === "groq" ? (
            <p className="llm-hint prose-flow">{ui.hintGroq}</p>
          ) : null}
        </div>

        <div className="field">
          <label className="label" htmlFor={labelId}>
            {ui.inputLabel}
          </label>
          <textarea
            id={labelId}
            ref={taRef}
            className="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            spellCheck={false}
          />
        </div>

        <div className="goose-bar">
          <div className="goose-cluster">
            {showBubble ? (
              <div className="bubble-wrap" aria-live="polite">
                <div className="bubble">
                  <div className="bubble-inner prose-flow">
                    {goose.kind === "loading" ? (
                      <span className="writing">{ui.loading}</span>
                    ) : (
                      bubbleText
                    )}
                  </div>
                </div>
                <div className="bubble-tail" aria-hidden />
              </div>
            ) : null}

            <button
              type="button"
              className="goose-hit"
              onClick={onGooseClick}
              disabled={goose.kind === "loading"}
              aria-label={ui.gooseAria}
            >
              <span className="goose-ico" aria-hidden>
                🦢
              </span>
            </button>
          </div>

          {showActions ? (
            <div className="action-row">
              <button type="button" className="btn primary" onClick={onSave}>
                {ui.save}
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={onRegenerate}
                disabled={goose.kind === "loading"}
              >
                {ui.regenerate}
              </button>
            </div>
          ) : null}
        </div>

        <section className="saved" aria-labelledby={savedHeadingId}>
          <h2 className="saved-title" id={savedHeadingId}>
            {ui.savedTitle}
          </h2>
          {saved.length === 0 ? (
            <p className="saved-empty">{ui.savedEmpty}</p>
          ) : (
            <ul className="saved-list">
              {saved.map((item) => (
                <li key={item.id} className="saved-card">
                  <div className="saved-meta">
                    <span className="pill">
                      {item.fromSelection
                        ? ui.pillSelection
                        : ui.pillFull}
                    </span>
                  </div>
                  <p className="saved-prompt prose-flow">{item.prompt}</p>
                  <p className="saved-reply prose-flow">{item.reply}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
