import { GoogleGenAI } from "@google/genai";

// Fix: The API key must be obtained from `process.env.API_KEY` and used directly.
// This resolves the TypeScript error regarding `import.meta.env` and aligns with the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (spanishText: string, englishText: string): string => {
    return `
You are an expert document formatter. Your task is to merge a Spanish bible study guide and its English translation into a single, bilingual Markdown document. You must follow the provided formatting rules with extreme precision. The Spanish content should always come before the English content in each section.

**Formatting Rules:**

1.  **Markdown Styles:**
    *   Bold: **text**
    *   Italic: *text*
    *   Bold and Italic: ***text***
    *   Underline: _text_

2.  **Bullet Indentation:**
    *   First level: \`- text\` (no spaces before)
    *   Second level: \`  • text\` (2 spaces before)
    *   Third level: \`    • text\` (4 spaces before)

3.  **Fill-in-the-blanks and Textareas:**
    *   For blank lines for users to fill in, use \`[input:es-#:__________]\` for Spanish and \`[input:en-#:__________]\` for English. The \`#\` must be a single, sequential number for all inputs throughout the entire document, starting from 1.
    *   For textarea boxes, use \`[textarea:es-#]\` for Spanish and \`[textarea:en-#]\` for English. The \`#\` must be a separate, sequential number for all textareas throughout the entire document, starting from 1.
    *   The prayer section's textarea is special: use \`[textarea:es-prayer-notes]\` for Spanish and \`[textarea:en-prayer-notes]\` for English.

4.  **Document Structure:**
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

    *   **Main Sections (can be 1 or more):** For each section, format as follows:
        [Título completo de la sección en español]
        #### [1. Subtítulo sin negrita]
        [Contenido con bullets y [input]s]
        #### [2. Subtítulo sin negrita]
        [Contenido con bullets y [input]s]
        (Repeat for all Spanish subtitles in the section)

        [Título completo de la sección en ingles]
        #### [1. Subtítulo sin negrita]
        [Contenido con bullets y [input]s]
        #### [2. Subtítulo sin negrita]
        [Contenido con bullets y [input]s]
        (Repeat for all English subtitles in the section)

    *   **Conclusion Section:**
        ### CONCLUSIÓN:
        Conclusión:
        #### Reflexión General:
        [Contenido reflexión español]
        [textarea:es-#] (continue textarea numbering)

        #### Oración:
        [Contenido oración español]
        [textarea:es-prayer-notes]

        Conclusion:
        #### General Reflection:
        [Contenido reflexión inglés]
        [textarea:en-#] (continue textarea numbering)

        #### Prayer:
        [Contenido oración inglés]
        [textarea:en-prayer-notes]

**Input Documents:**

--- SPANISH DOCUMENT START ---
${spanishText}
--- SPANISH DOCUMENT END ---

--- ENGLISH DOCUMENT START ---
${englishText}
--- ENGLISH DOCUMENT END ---

Now, generate the merged Markdown document based on all the rules and the provided texts. Do not include any explanations, warnings, or apologies. Output ONLY the final Markdown content.
    `;
}

export const mergeDocuments = async (spanishText: string, englishText: string): Promise<string> => {
    try {
        const prompt = buildPrompt(spanishText, englishText);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.1, // Lower temperature for more deterministic, rule-based output
            }
        });

        const mergedText = response.text;

        // Final cleanup to remove potential code block fences
        return mergedText.replace(/^```markdown\s*/, '').replace(/```$/, '').trim();

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("The AI service failed to process the request. Please check your API key and try again later.");
    }
};