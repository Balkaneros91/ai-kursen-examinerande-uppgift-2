"use client";

import { useMemo, useState } from "react";

type Article = { title: string; body: string };

type TonePreset = { label: string; value: string };

const tonePresets: TonePreset[] = [
  {
    label: "Explosiv breaking",
    value:
      "Explosiv kvällstidningsstil med högt tempo, dramatik och kraftfulla verb som fångar läsaren direkt.",
  },
  {
    label: "Vardaglig dramatik",
    value:
      "Berättande vardagsdramatik med känslor och igenkänning, korta meningar och tydliga kontraster.",
  },
  {
    label: "Tekno-eufori",
    value:
      "Euforisk teknikton med framtidslöften, stora ord och känsla av framsteg och upptäckt.",
  },
  {
    label: "Skandalavslöjande",
    value:
      "Avslöjande ton med antydan om hemligheter, läckta detaljer och provokativt språk.",
  },
];

// ✅ Simplified: no regex, no JSON parse
const extractArticle = (raw: string): Article => {
  const fallback: Article = {
    title: "EXTRA: AI skapade ingen rubrik",
    body:
      raw.trim() ||
      "Ingen text genererades. Prova igen med en tydligare instruktion.",
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

  const promptText = useMemo(() => {
    const cleanedTopic = topic.trim() || "AI och dess påverkan på samhället";
    const uppercasePrefix = (prefix.trim() || "EXTRA").toUpperCase();
    const angleText = angle.trim()
      ? `Fokusera på vinkeln: ${angle.trim()}.`
      : "Välj en oväntad men trovärdig vinkel som bygger på ämnet.";

    const lines: string[] = [
      "Du är reporter på en svensk kvällstidning som skriver blixtrande snabba artiklar.",
      "Skapa en rubrik och en brödtext med följande krav:",
      `- Rubriken måste börja med \"${uppercasePrefix}:\".`,
      "- Rubriken ska skrivas helt i versaler och innehålla högst 12 ord.",
      "- Brödtexten ska bestå av tre korta stycken med två meningar i varje.",
      "- Använd energi, konkreta detaljer och minst ett direkt citat.",
      `Ämne: ${cleanedTopic}`,
      angleText,
      `Ton: ${tone}`,
      "Skriv på naturlig svenska med kvällstidningskänsla, använd slagkraftiga uttryck och vardagligt språk.",
      "Svara endast med rubrik överst och därefter brödtext, separerad med radbrytningar.",
    ];

    return lines.join("\n");
  }, [angle, prefix, tone, topic]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Skriv in ett ämne innan du genererar en artikel.");
      return;
    }

    setLoading(true);
    setError(null);

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
      setError(
        "Kunde inte skapa artikel just nu. Testa att ändra instruktionen och försök igen."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#111]">
      <header className="shadow-xl">
        <div className="bg-[#b80000] text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <span className="text-3xl font-black italic tracking-tight">
              AIftonbladet
            </span>
            <span className="hidden text-xs font-semibold uppercase tracking-wider sm:block">
              Uppdateras av din egen AI-redaktion
            </span>
          </div>
        </div>
        <div className="bg-[#ffd400] text-[#111]">
          <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <span>AI-BREAKING</span>
            <span>TEKNIK</span>
            <span>SKOLA</span>
            <span>EKONOMI</span>
            <span>SPORT-TECH</span>
            <span>KULTUR</span>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[2fr_1fr]">
        <article className="relative overflow-hidden rounded-xl border border-black/5 bg-white shadow-2xl">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-2xl font-black uppercase tracking-[0.4em] text-[#b80000]">
              Genererar
            </div>
          )}

          <div className={loading ? "pointer-events-none opacity-40" : undefined}>
            <div className="border-b border-black/10 bg-[#ffd400] px-6 py-3">
              <span className="text-xs font-extrabold uppercase tracking-[0.5em] text-[#b80000]">
                Senaste nytt
              </span>
            </div>

            <div className="px-6 py-8">
              {article ? (
                <div className="space-y-6">
                  <h1 className="text-4xl font-black uppercase leading-tight text-[#111] sm:text-5xl">
                    {article.title}
                  </h1>

                  <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#555]">
                    <span>
                      {timestamp
                        ? `Publicerad ${timestamp}`
                        : "Publicerad just nu"}
                    </span>
                    <span>AI-REDAKTIONEN</span>
                    <span>
                      {prefix.trim()
                        ? `Tagg: ${prefix.trim()}`
                        : "Direkt"}
                    </span>
                  </div>

                
                  <div className="space-y-3 text-lg leading-relaxed text-[#1a1a1a]">
                    {article.body.split(/\n{2,}/).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-lg text-[#555]">
                  <h2 className="text-3xl font-black uppercase text-[#b80000]">
                    Din AI-förstasida väntar
                  </h2>
                  <p>
                    Välj ämne, ton och format i kontrollpanelen för att låta din
                    anslutna AI skriva nattens stora rubrik.
                  </p>
                  <p>
                    Testa till exempel ett skolevenemang, en tekniknyhet eller
                    en lokal händelse och se hur rubriken kastas fram i stor
                    stil.
                  </p>
                </div>
              )}
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-xl border border-black/5 bg-white p-6 shadow-xl">
            <h2 className="text-xl font-black uppercase text-[#b80000]">
              AI-nyhetsverkstad
            </h2>

            <div className="mt-6 space-y-5">
              <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-[#555]">
                Ämne
              </label>
              <input
                type="text"
                placeholder="Till exempel: AI i klassrummet"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded border border-black/15 bg-[#fef9e7] px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[#111] placeholder:text-[#999] focus:border-[#b80000] focus:outline-none focus:ring-2 focus:ring-[#ffd400]"
              />

              <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-[#555]">
                Vinkel (valfri)
              </label>
              <textarea
                rows={2}
                placeholder="Vad är twisten eller det mest dramatiska som händer?"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm leading-relaxed text-[#111] placeholder:text-[#999] focus:border-[#b80000] focus:outline-none focus:ring-2 focus:ring-[#ffd400]"
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-[#555]">
                  Prefix för rubriken
                </label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                  className="mt-1 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm font-semibold uppercase tracking-[0.4em] text-[#111] focus:border-[#b80000] focus:outline-none focus:ring-2 focus:ring-[#ffd400]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-[#555]">
                  Ton
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="mt-1 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[#111] focus:border-[#b80000] focus:outline-none focus:ring-2 focus:ring-[#ffd400]"
                >
                  {tonePresets.map((preset) => (
                    <option key={preset.label} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="rounded border border-[#b80000]/40 bg-[#b80000]/5 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#b80000]">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full rounded-full bg-[#b80000] px-5 py-3 text-sm font-black uppercase tracking-[0.4em] text-white transition hover:bg-[#a00000] disabled:cursor-not-allowed disabled:bg-[#d3d3d3] disabled:text-[#777]"
              >
                {loading ? "AI skriver..." : "Generera förstasidan"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-black/5 bg-white p-6 shadow-lg">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#b80000]">
              Prompt som skickas till AI
            </h3>
            <textarea
              readOnly
              value={promptText}
              className="mt-3 h-56 w-full rounded border border-black/10 bg-[#f9f9f9] px-3 py-2 text-xs font-mono leading-5 text-[#111]"
            />
          </div>
        </aside>
      </section>
    </main>
  );
}
