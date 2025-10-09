# AI-baserad webbapplikation

## Syfte till vårat projekt

Syftet med projektet AI-Afton är att utveckla en webbapplikation som på ett humoristiskt och realistiskt sätt efterliknar en kvällstidning. Användaren skriver in ett eller flera ord som representerar ett ämne, och applikationen genererar automatiskt en titel och en brödtext baserad på dessa ord. Användaren kan dessutom lägga till valfri kompletterande text för att göra resultatet mer specifikt eller vinklat. Målet är att demonstrera hur modern AI-teknik kan användas för att skapa övertygande, men fiktiva, nyhetstexter — och samtidigt ge insikt i hur lätt innehåll kan framstå som trovärdigt trots att det är helt AI-genererat.

## Reflektion över följande

1. Vilken ny AI-teknik/bibliotek identifierade ni och hur tillämpade ni det?

- I projektet identifierade vi och använde @google/generative-ai, ett modernt JavaScript-bibliotek som ger tillgång till Googles generativa språkmodeller. Vi implementerade det i vår Next .js 15-applikation för att generera både rubriker och brödtexter utifrån användarens inmatning. När användaren skickar in sitt ämne via gränssnittet anropar applikationen ett API-endpoint som i sin tur kommunicerar med den generativa AI-modellen. Modellen tolkar användarens ord, skapar ett textförslag som liknar en kvällstidningsartikel och returnerar resultatet till frontend, där texten visas direkt i realtid.
- Genom denna integration kunde vi på ett konkret sätt visa hur ett modernt AI-bibliotek kan skapa kreativa och språkligt sammanhängande texter baserat på enkla inputs.

2. Motivera varför ni valde den AI-tekniken/det biblioteket.

- Vi valde att arbeta med @google/generative-ai eftersom det erbjuder en stabil och lättanvänd SDK direkt i JavaScript-miljö, vilket passade vår tech-stack med Next .js och React. Biblioteket gjorde det möjligt att snabbt bygga ett fungerande AI-flöde utan att behöva sätta upp en egen server eller träningsmiljö för språkmodeller.
- En annan anledning var att Google-modellen levererar naturligt formulerade och varierade texter, vilket var avgörande för att skapa trovärdiga kvällstidningsliknande artiklar. Dess API är dessutom väldokumenterat och fungerar bra med TypeScript, vilket underlättade utvecklingen och minskade antalet fel.
- Valet grundade sig därför både i teknisk kompatibilitet och språklig kvalitet, vilket gjorde att vi kunde fokusera på kreativ tillämpning snarare än på komplicerad modellhantering.

3. Varför behövdes AI-komponenten? Skulle ni kunna löst det på ett annat sätt?

- AI-komponenten var en central del av projektet eftersom hela idén bygger på att automatiskt generera trovärdiga texter utifrån fria användarinputs. En traditionell lösning med fördefinierade mallar eller hårdkodade textblock hade inte kunnat ge samma variation, kreativitet och naturligt språkflöde.
- Den generativa AI-modellen möjliggjorde att varje användares ämne tolkades unikt, vilket gav oväntade men ändå sammanhängande resultat – precis det som behövdes för att simulera känslan av en riktig kvällstidning.
- Tekniskt sett hade man kunnat skapa enklare versioner med t.ex. slumpade meningar eller keyword-baserade textmallar, men det hade resulterat i mekaniska och upprepade texter utan den “mänskliga” ton som gör projektet engagerande. Därför var AI-komponenten inte bara ett val – den var nödvändig för att uppnå syftet och den önskade illusionen.

### Syfte

Uppgiften går ut på att skapa en tjänst som använder modern AI-teknik på något vis.
Med modern AI-teknik menas: Anrop till AI-API:er så som LLMs, embedding-modeller, klassificerings-modeller eller liknande.
Ni väljer själva målsättningen med tjänsten, och att utforska detta med AI-stöd är en del av arbetet med uppgiften.

Ta chansen och påbörja arbetet på ett projekt ni varit sugna på att göra länge!
Fokus ligger inte endast på att få allting att fungera utan snarare att utforska och se, var går det fel och vad är svårt med AI?

## Instruktioner

Skapa en webb-applikation inom valfritt ramverk (React, Next, Vite). Tips är att välja ett "stort" språk för att underlätta utveckling med AI. Applikationen ska innehålla minst en AI-komponent som fyller en tydlig funktion i applikationen (chattbot, bildgenerering, sökning etc.)

Tips:

- Innan ni sätter igång och kodar - sätt upp en tydlig plan, gör research, välj ramverk med omsorg, planera applikationen.

## Bedömning

### Krav för Godkänt

- Applikationen använder en LLM eller annan AI-teknik (bildgenereringsmodeller, ljudgenereringsmodeller, semantisk sökning med embeddings)
- Applikationen ska helt (eller delvis) utvecklas med stöd av AI (Github CoPilot, Gemini CLI, Cursor, ChatGPT)

- Applikationen ska vara väldokumenterad/välkommenterad (visa på förståelse för koden) och arbetet med den kan användas som underlag till era skriftliga inlämningar (uppgift 1).
- I **README.md** ska även en reflektion över följande vara med:
  - Vilken ny AI-teknik/bibliotek identifierade ni och hur tillämpade ni det?
  - Motivera varför ni valde den AI-tekniken/det biblioteket.
  - Varför behövdes AI-komponenten? Skulle ni kunna löst det på ett annat sätt?

### Vidareutveckling för Väl Godkänt

- Visat på stor säkerhet och skicklighet i sin identifikation och tillämpning av AI-komponenten
  - Ex. använt de mer avancerade tekniker vi gått igenom, hittat egna bibliotek eller på annat sätt fördjupat sig.
- Visat på stor säkerhet och skicklighet i sitt avgörande kring om AI var en lämplig lösning

---

### Inlämning

- Ett github repo med fullständig kod samt **readme.md** som innehåller svar på de reflekterande frågorna ovan.
- Kodinlämning i Canvas med länk till git repository (t.ex. GitHub)
- Inlämning senast **måndag den 20e oktober kl. 23:59**

---

### Kursmål som uppfylls (7-8) enligt kursplan

7.) Självständigt identifiera och tillämpa ny AI-teknik eller bibliotek i syfte att lösa programmeringsproblem.
8.) Analysera en teknisk problemställning och avgöra när AI är en lämplig lösning och när det inte är det. Både i utvecklandet av applikationen samt i applikationen självt.

---

### Förslag på applikationer

**Embeddings**
Anteckningssök: Sök i egna anteckningar med embeddings (Supabase).
Rekommendationslista: Hitta liknande filmer/böcker/produkter via embeddings.

**LLMs**
FAQ-bot: Använd en LLM för att svara på frågor (med eller utan embeddings). (Reflektera över hallucinationer och behovet av egen data.)
Idégenerator: En liten webapp där man kan få förslag (t.ex. middagsidéer, träningspass, reserutter). (Reflektera över kvalitet, bias och kostnader.)
Text-till-text filter: Låt en användare mata in text och få en omskriven version (t.ex. mer formell, kortare, på annan stil). (Diskutera när AI är värdefullt vs. vanlig regex/replace.)

**Andra AI-API:er**

Bild- eller ljudgenerator: Bygg ett litet gränssnitt där man skickar promptar till ett API som returnerar en bild eller ljud. (Reflektera kring kontroll, begränsningar, upphovsrätt?.)

**MEN!** - Dessa är bara förslag! Låt fantasin flöda - använd AI för att hjälpa er med idé -> planering -> utförande.
