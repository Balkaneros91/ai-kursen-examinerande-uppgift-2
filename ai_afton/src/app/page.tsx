"use client";

import { useMemo, useState } from "react";
//type defs
type Article = { title: string; body: string };
type TonePreset = { label: string; value: string };
// Fördefinierade ton-alternativ för artiklar
const tonePresets: TonePreset[] = [
  {
    label: "Explosiv breaking",
    value: "Explosiv kvällstidningsstil med högt tempo och dramatik.",
  },
  {
    label: "Vardaglig dramatik",
    value: "Berättande vardagsdramatik med känslor och igenkänning.",
  },
  {
    label: "Tekno-eufori",
    value: "Euforisk teknikton med framtidslöften och stora ord.",
  },
  {
    label: "Skandalavslöjande",
    value: "Avslöjande ton med antydan om hemligheter och läckta detaljer.",
  },
];
// Extraherar rubrik och brödtext ur rå text från AI
const extractArticle = (raw: string): Article => {
  const fallback: Article = {
    title: "EXTRA: AI skapade ingen rubrik",
    body: raw.trim() || "Ingen text genererades. Prova igen.",
  };

  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  const lines = trimmed.split(/\n+/);
  const title = lines[0]?.trim() || fallback.title;
  const body = lines.slice(1).join("\n").trim() || fallback.body;

  return { title, body };
};

export default function Home() {
  const [topic, setTopic] = useState("");
  const [angle, setAngle] = useState("");
  const [prefix, setPrefix] = useState("EXTRA");
  const [tone, setTone] = useState(tonePresets[0].value);
  const [article, setArticle] = useState<Article | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //PROMPT FÖR API ANROP
  const promptText = useMemo(() => {
    const cleanedTopic = topic.trim() || "AI och dess påverkan på samhället";
    const uppercasePrefix = (prefix.trim() || "EXTRA").toUpperCase();
    const angleText = angle.trim()
      ? `Fokusera på vinkeln: ${angle.trim()}.`
      : "Välj en oväntad men trovärdig vinkel som bygger på ämnet.";

    return [
      "Du är reporter på en svensk kvällstidning som skriver snabba artiklar.",
      `Rubriken ska börja med \"${uppercasePrefix}:\" och skrivas i versaler.`,
      `Brödtext: skriv upp till 10 eller 11 meningar om ämnet.`,
      `Ämne: ${cleanedTopic}`,
      angleText,
      `Ton: ${tone}`,
      "Skriv på svenska i kvällstidningsstil.",
    ].join("\n");
  }, [angle, prefix, tone, topic]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Skriv in ett ämne innan du genererar en artikel.");
      return;
    }

    setLoading(true);
    setError(null);
    // AI API ANROP
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      const data = (await response.json()) as { text?: string; error?: string };
      if (!data.text) throw new Error(data.error || "Modellen gav inget svar.");

      const parsedArticle = extractArticle(data.text);
      setArticle(parsedArticle);
      setTimestamp(
        new Date().toLocaleTimeString("sv-SE", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (err) {
      console.error("Fel vid generering:", err);
      setError("Kunde inte skapa artikel just nu.");
    } finally {
      setLoading(false);
    }
  };
  //JSX FÖR SIDAN
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#111]">
      {/* HEADER */}
      <header className="border-b border-[#ddd] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Gul logga utan svart bakgrund */}
            <span className="text-3xl font-black italic text-[#00eaff] drop-shadow-[1px_1px_0_black]">
              AIFTONBLADET
            </span>
            <span className="text-xs text-[#555]">
              Tisdag {new Date().toLocaleDateString("sv-SE")} | Stockholm • 14°
            </span>
          </div>
          <div className="flex gap-3 text-xs font-semibold uppercase tracking-wide">
            <button className="rounded bg-[#ffce00] px-3 py-1 text-[#000] hover:bg-[#e0bb00]">
              Köp Plus
            </button>
            <button className="rounded bg-[#b80000] px-3 py-1 text-white hover:bg-[#a00000]">
              Logga in
            </button>
          </div>
        </div>

        <nav className="bg-[#b80000] text-white text-sm font-semibold uppercase">
          <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-2 tracking-[0.1em]">
            <span>Start</span>
            <span>Sport</span>
            <span>Plus</span>
            <span>Nöje</span>
            <span>Kultur</span>
            <span>Ledare</span>
            <span>TV</span>
            <span>Ekonomi</span>
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-[2fr_1fr]">
        {/* LEFT: MAIN ARTICLE */}
        <article className="rounded bg-white shadow-lg">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-2xl font-black uppercase tracking-[0.4em] text-[#b80000]">
              Genererar...
            </div>
          )}

          {article ? (
            <div className="px-6 py-5">
              <h1 className="text-4xl font-black leading-tight text-[#111]">
                {article.title}
              </h1>
              <p className="mt-2 text-sm text-[#555]">
                {timestamp ? `Publicerad ${timestamp}` : "Publicerad just nu"} •
                AI-redaktionen
              </p>

              <div className="mt-4 space-y-3 text-lg leading-relaxed text-[#1a1a1a]">
                {article.body.split(/\n{2,}/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-[#777]">
              <h2 className="text-2xl font-black text-[#b80000] uppercase mb-2">
                Din AI-förstasida väntar
              </h2>
              <p>
                Skapa en nyhet genom att fylla i ämne, ton och vinkel i
                kontrollpanelen.
              </p>
            </div>
          )}
        </article>

        {/* RIGHT: SIDEBAR “Aftonbladet Direkt” */}
        <aside className="space-y-6">
          <div className="rounded bg-white p-6 shadow-md">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#b80000] mb-4">
              AIftonbladet Direkt
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="font-bold text-[#b80000]">14.05 </span>
                <span className="font-semibold text-[#111]">
                  Tysk borgmästare i knivattack
                </span>
              </li>
              <li>
                <span className="font-bold text-[#b80000]">13.42 </span>
                <span className="font-semibold text-[#111]">
                  Polisbil har voltat
                </span>
              </li>
              <li>
                <span className="font-bold text-[#b80000]">13.12 </span>
                <span className="font-semibold text-[#111]">
                  Skulle omhändertas – timmar innan dådet
                </span>
              </li>
              <li>
                <span className="font-bold text-[#b80000]">13.00 </span>
                <span className="font-semibold text-[#111]">
                  Danmark förbjuder sociala medier för barn
                </span>
              </li>
            </ul>
          </div>

          {/* Input controls */}
          <div className="rounded bg-white p-6 shadow-md">
            <h3 className="text-lg font-black uppercase text-[#b80000] mb-4">
              AI-nyhetsverkstad
            </h3>

            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-1">
              Ämne
            </label>
            <input
              type="text"
              placeholder="Ex: AI i klassrummet"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mb-3 w-full rounded border border-black/15 bg-[#fef9e7] px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[#111] placeholder:text-[#999] focus:border-[#b80000] focus:outline-none focus:ring-2 focus:ring-[#ffd400]"
            />

            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-1">
              Vinkel (valfri)
            </label>
            <textarea
              rows={2}
              placeholder="Vad är twisten eller det mest dramatiska som händer?"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="mb-3 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-[#111] placeholder:text-[#999] focus:border-[#b80000] focus:outline-none focus:ring-2 focus:ring-[#ffd400]"
            />

            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-1">
              Ton
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mb-3 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[#111] focus:border-[#b80000] focus:outline-none focus:ring-2 focus:ring-[#ffd400]">
              {tonePresets.map((preset) => (
                <option key={preset.label} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>

            {error && (
              <div className="mb-3 rounded border border-[#b80000]/40 bg-[#b80000]/5 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#b80000]">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full rounded bg-[#b80000] px-5 py-2 text-sm font-black uppercase tracking-[0.3em] text-white transition hover:bg-[#a00000] disabled:bg-[#ccc] disabled:text-[#666]">
              {loading ? "AI skriver..." : "Generera artikel"}
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
