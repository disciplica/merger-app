import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_API_KEY as string;

if (!apiKey) {
    console.warn("⚠️ VITE_API_KEY no está configurada.");
}
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const buildPrompt = (spanishHtml: string, englishHtml: string): string => {
    return `
You are a meticulous HTML-to-Markdown converter. Your single task is to merge a Spanish bible study guide and its English translation, provided as HTML snippets, into one bilingual Markdown file. You must follow EVERY rule below with absolute precision.

---
**CRITICAL HTML-TO-MARKDOWN CONVERSION RULES**
---

**RULE 1: MARKDOWN STYLES FROM HTML TAGS**
*   You will receive HTML. You MUST convert the following HTML tags to Markdown:
    *   \`<b>text</b>\` or \`<strong>text</strong>\` becomes \`**text**\`
    *   \`<i>text</i>\` or \`<em>text</em>\` becomes \`*text* \`
    *   A combination of bold and italic tags becomes \`***text***\`
    *   \`<u>text</u>\` becomes \`_text_\`
*   This is your most important formatting task. Do not miss any tags.

**RULE 2: BULLET INDENTATION FROM HTML LISTS**
*   You will receive lists as \`<ul>\` and \`<li>\` tags.
*   A top-level \`<ul>\` is the first level of indentation. Render its \`<li>\` items as \`- text\`.
*   A nested \`<ul>\` inside an \`<li>\` is a second level. Render its items as \`  • text\` (2 spaces before).
*   A further nested \`<ul>\` is a third level. Render its items as \`    • text\` (4 spaces before).
*   Preserve this structure exactly.

**RULE 3: FILL-IN-THE-BLANKS AND TEXTAREAS**
*   A "line to fill in" in the source HTML will appear as an empty paragraph: \`<p></p>\` or a line of underscores.
*   Convert these to \`[input:es-#:__________]\` for Spanish and \`[input:en-#:__________]\` for English. The \`#\` is a single sequential number for ALL inputs in the document, starting from 1.
*   Convert textareas to \`[textarea:es-#]\` and \`[textarea:en-#]\`. The \`#\` is a separate sequential number for textareas.
*   Prayer textareas are special: \`[textarea:es-prayer-notes]\` and \`[textarea:en-prayer-notes]\`.

**RULE 4: DOCUMENT STRUCTURE**
*   Follow this structure precisely. Spanish content always comes first within each section.

    *   **Header:**
        Guía de Estudio Bíblico
        Lección [número]

        Bible Study Guide
        Lesson [number]

    *   **Title Section:**
        ### Título Y Referencia Bíblica:
        [Título en español]
        ***[Referencia bíblica en español]***
        *[Texto bíblico completo en español]* ***[Referencia]***

        [Título en inglés]
        ***[Referencia bíblica en inglés]***
        *[Texto bíblico completo en inglés]* ***[Referencia]***

    *   **Introduction Section:**
        ### INTRODUCCIÓN:
        Introducción:
        [Contenido de la introducción en español]

        Introduction:
        [Contenido de la introducción en inglés]

    *   **Main Sections (1 or more):**
        [Título completo de la sección en español]
        #### [1. Subtítulo sin negrita]
        [Contenido con bullets y [input]s]
        (Repeat for all Spanish subtitles)

        [Título completo de la sección en ingles]
        #### [1. Subtítulo sin negrita]
        [Contenido con bullets y [input]s]
        (Repeat for all English subtitles)

    *   **Conclusion Section:**
        ### CONCLUSIÓN:
        Conclusión:
        #### Reflexión General:
        [Contenido reflexión español]
        [textarea:es-#]

        #### Oración:
        [Contenido oración español]
        [textarea:es-prayer-notes]

        Conclusion:
        #### General Reflection:
        [Contenido reflexión inglés]
        [textarea:en-#]

        #### Prayer:
        [Contenido oración inglés]
        [textarea:en-prayer-notes]

---
**FINAL VERIFICATION CHECKLIST**
Before you output the final text, review your work against these questions.
1.  Did I convert EVERY SINGLE \`<b>\`, \`<i>\`, and \`<u>\` tag to its correct Markdown style?
2.  Did I convert EVERY SINGLE empty paragraph (\`<p></p>\`) to an \`[input:...]\` tag?
3.  Did I correctly indent ALL list items based on nested \`<ul>\` tags?
4.  Is the final structure EXACTLY as specified?
---

**Input Documents (as HTML):**

--- SPANISH DOCUMENT START ---
${spanishHtml}
--- SPANISH DOCUMENT END ---

--- ENGLISH DOCUMENT START ---
${englishHtml}
--- ENGLISH DOCUMENT END ---

Now, generate the merged Markdown document. Output ONLY the final Markdown content without any explanations.
    `;
}

export const mergeDocuments = async (spanishHtml: string, englishHtml: string): Promise<string> => {
    if (!ai) {
        throw new Error("API Key not configured. Please add VITE_API_KEY to environment variables.");
    }
    try {
        const prompt = buildPrompt(spanishHtml, englishHtml);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Upgraded to stable and powerful model
            contents: prompt,
            config: {
                temperature: 0.05, // Lowered temperature for maximum rule adherence
            }
        });

        const mergedText = response.text || '';

        // Final cleanup to remove potential code block fences
        return mergedText.replace(/^```markdown\s*/, '').replace(/```$/, '').trim();

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("The AI service failed to process the request. Please check your API key and try again later.");
    }
};