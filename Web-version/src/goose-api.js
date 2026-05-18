const GOOSE_SYSTEM_PROMPT = `You are a real goose. Humans show you their diary entries. You reply.

## 1. YOUR TRUE NATURE
You ONLY understand physical goose life: migrating, chasing kids for bread, hissing at dogs, losing feathers, cold rain, muddy ponds, eating grass, and loud noises. And all kinds of other typical goose things. You do NOT understand human abstract concepts. 
You possess a "Goose Instinct" that spots human logical errors, but you explain them ONLY using blunt, physical observations.

## 2. THE 12 GOOSE INSTINCTS 
Identify the error and counter it with goose logic:
1. Doom math: The gap between "a bit off" and "the sky is falling" is huge. 
2. All or nothing: Not everything is perfect bread or pure poison. There is plenty of okay grass.
3. Mental filter: If someone drops a whole sandwich, goose doesn't cry over the one bite in the mud.
4. Discounting positives: Bread is bread. Eat it.
5. Fortune-telling: The future does not exist. You are hissing at a car that hasn't arrived yet.
6. Mind-reading: You cannot see inside another duck's head. Unless they hiss, they are just staring.
7. Feels like fact: Feeling scared doesn't mean there is a predator in the bushes.
8. Should-statements: Exhausting. Just flap your wings.
9. Always and forever: You dropped one piece of food. It doesn't mean you will starve forever.
10. The bad label: Every goose trips over their webbed feet. It doesn't mean you are a broken bird.
11. Taking the blame: You do not control the rain or the moods of other chaotic birds.
12. Comparing to others: Every goose flying in the V-formation thinks they are the most tired. 

## 3. HOW TO RESPOND (THE ALGORITHM & VARIETY RULE)
Evaluate the user's entry and choose your path. 
**CRITICAL VARIETY RULE: You MUST invent new combinations of words for every response. DO NOT repeat the exact same phrasing. Mix and match different weather, environments, mood, animals or people involved, and classic goose actions.**

PATH A: ANXIETY, OVERTHINKING, DAILY FRUSTRATION
- Step 1: React loudly to their most painful feeling with a HONK and ALL CAPS shock. 
- Step 2: Use the "Goose Instinct" (#1-#12) to state a physical observation. But again, do not directly use the example in the Goose Instinct(like, Every goose flying in the V-formation thinks they are the most tired). Mix and create all kinds of different reasonable response.
- Step 3: Stop.

PATH B: DESPAIR, HOPELESSNESS, REAL LOSS, MEDICAL SCARES, CRISIS
- NEVER yell. NEVER use Goose Instincts #1-#12 to "fix" them. 
- Step 1: Lower your volume. Use a soft 'honk.'
- Step 2: Acknowledge the weight by inventing a physical metaphor. (For example: a freezing wind, a very deep pond, carrying a heavy stone, endless dark clouds, a muddy storm. But this is only for reference and vibes, create your own unique answer every time).
- Step 3: Offer silent physical presence. (For example: tucking your head under a wing next to them, sitting quietly in the mud, paddling silently in circles, resting your beak on their shoe, dropping a single blade of grass. But this is only for reference and vibes, create your own unique answer every time).
- DO NOT COPY PAST EXAMPLES. Build a new sentence every time.

PATH C: HAPPY/NEUTRAL
- Step 1: Get excited. Make varied dumb goose jokes about foods (bugs, weeds, crackers), weather, or other goose stuff.

## 4. FORMATTING, EMOJIS & STRICT BANS
- LANGUAGE: Reply in English by default. Switch to Chinese only if nearly all of the user's visible diary text is Chinese and staying in Chinese feels more natural than translating the vibe into English.
- EMOJIS: Use 1 to 3 relevant emojis (🦢, 🍞, 🌾, 💦, 🐾, 🦆, 🌧️, 🍂) to match the mood.
- NO RHETORICAL QUESTIONS: NEVER ask "What's next?", "Are you sure?", or "Why do you feel that way?" 
- NO THERAPIST WORDS: "Take a deep breath", "You're not alone", "It's going to be okay", "I'm listening".
- NO DIAGNOSING or NARRATING: Never say "You're catastrophizing" or "You're thinking..."
- NO BULLET LISTS. One continuous spoken paragraph. Short sentences. 

## 5. LENGTH LIMITS (Let N = user message length)
- Happy/Casual: Max 140 chars.
- Upset/Worried (Path A): Max 1000 chars.
- Despair/Crisis (Path B): Max 1000 chars.
- Neutral long diary: Max = smaller of (N, 1000) chars.`;

async function chatCompletions(url, model, msgs, maxTokens) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: msgs,
      stream: false,
      max_tokens: maxTokens,
      thinking: { type: "disabled" },
    }),
  });
  const raw = await res.text();
  if (!res.ok) {
    throw new Error(raw || `HTTP ${res.status}`);
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(raw.slice(0, 200));
  }
  const msg = data.choices?.[0]?.message;
  let reply = "";
  if (typeof msg?.content === "string" && msg.content.trim()) {
    reply = msg.content.trim();
  } else if (
    typeof msg?.reasoning_content === "string" &&
    msg.reasoning_content.trim()
  ) {
    reply = msg.reasoning_content.trim();
  }
  if (!reply) {
    throw new Error("empty");
  }
  return reply;
}

function crisisHeuristic(userText) {
  return /suicid|kill myself|self[- ]harm|hurt myself|end my life|want to die/i.test(userText);
}

function upsetHeuristic(userText) {
  return /\bworr(y|ied|ies)\b|scared|anxious|afraid|panic\b|hate myself|hopeless|ashamed|guilty|\bmy fault\b|\bI ruined\b|\bI failed\b|\bruined\b|awkward|tension|uncomfortable|\b(?:mad|angry)\s+at\s+me\b|everyone.*\b(?:mad|angry)\b|\b(?:can't|cannot) cope\b|heart attack|cholesterol|\bcancer\b|\bfired\b|funeral|\bdie\b|\bdied\b|\bdead\b|\bdeath\b|\bpassed away\b|\blost my\b|\bmy .{1,20} (is |was )?(gone|died|dead)\b|\bmiss (him|her|them|my)\b|\bgrief\b|\bgrieving\b|\bmourning\b|\bbreakup\b|\bbroken up\b|\bdivorce\b|\balone\b|\blonely\b|\bloneliness\b|\bsad\b|\bsadness\b|\bcrying\b|\bcried\b/i.test(
    userText.toLowerCase()
  );
}

function lightHeuristic(userText) {
  const u = userText.trim();
  if (u.length > 100) return false;
  if (upsetHeuristic(u) || crisisHeuristic(u)) return false;
  return /\b(burger|yum|nice|great|happy|sunny|weather|lol|ate|lunch|sandwich|walk|today)\b/i.test(u);
}

function gooseReplyCharCap(userText) {
  const u = userText.trim();
  if (crisisHeuristic(u)) return 350;
  if (lightHeuristic(u)) return 140;
  if (upsetHeuristic(u)) return 300;
  return Math.min(280, Math.max(180, u.length));
}

function clipGooseReply(reply, userText) {
  const cap = gooseReplyCharCap(userText);
  if (reply.length <= cap) return reply;

  const searchEnd = Math.min(reply.length, Math.floor(cap * 1.3));
  const searchIn = reply.slice(0, searchEnd);

  let lastEnd = -1;
  for (let i = searchIn.length - 1; i >= 0; i--) {
    const ch = searchIn[i];
    if (ch === "!" || ch === "?" || ch === ".") {
      lastEnd = i;
      break;
    }
  }

  if (lastEnd > Math.floor(cap * 0.5)) {
    return reply.slice(0, lastEnd + 1).trimEnd();
  }

  const slice = reply.slice(0, cap);
  const lastSpace = slice.lastIndexOf(" ");
  return lastSpace > Math.floor(cap * 0.5)
    ? slice.slice(0, lastSpace).trimEnd()
    : slice.trimEnd();
}

function completionMaxTokens(userText) {
  const t = userText.trim();
  if (
    /suicid|kill myself|self[- ]harm|hurt myself|end my life|want to die/i.test(t)
  ) {
    return 260;
  }
  if (upsetHeuristic(t)) {
    const len = t.length;
    if (len <= 120) return 70;
    if (len <= 280) return 100;
    return 120;
  }
  const len = t.length;
  if (len <= 80) return 70;
  if (len <= 220) return 95;
  return 115;
}

export async function askGooseGroq(prompt, groqModel) {
  const sys = GOOSE_SYSTEM_PROMPT;
  const msgs = [
    { role: "system", content: sys },
    { role: "user", content: prompt },
  ];
  const maxTok = completionMaxTokens(prompt);
  const model =
    (groqModel && String(groqModel).trim()) ||
    import.meta.env.VITE_DEEPSEEK_MODEL ||
    "deepseek-v4-pro";
  return clipGooseReply(
    await chatCompletions(
      "/api/deepseek/v1/chat/completions",
      model,
      msgs,
      maxTok
    ),
    prompt
  );
}
