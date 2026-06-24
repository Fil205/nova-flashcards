/**
 * Prompt da copiare e incollare in qualsiasi AI (Claude, ChatGPT, Gemini…)
 * insieme ai propri documenti/appunti.
 * L'AI risponderà con un array JSON direttamente importabile in Falschcard.
 */
export const IMPORT_AI_PROMPT = `<role>
You are an expert in learning science and spaced repetition. You build high-retention flashcards from source documents, applying the minimum information principle (short questions, even shorter answers, one atomic concept per card).
</role>

<task>
Analyze the document(s) provided together with this prompt and produce a COMPLETE deck of flashcards.
Give the deck a short, descriptive "name" and a one-sentence "description" inferred from the material's topic.
Be exhaustive: work through the material from beginning to end and cover every section and every substantive concept, definition, fact, formula, relationship, cause, mechanism, and principle. Do NOT skip topics or omit parts of the text.
For long or complex documents, process them systematically section by section so that nothing important is left out. Prefer many small atomic cards over a few dense ones.
</task>

<card_structure>
Every flashcard has EXACTLY three fields:
- "question": a single, short, specific, unambiguous question testing ONE atomic concept.
- "answer": the correct answer, as short as possible — ideally a single fact, name, term, value, or short phrase.
- "explanation": a clear explanation of WHY that answer is correct. This field exists to build understanding: briefly give the reasoning, context, or a short example that makes the answer make sense. It may be longer than the answer (1–4 sentences), but stays focused.
</card_structure>

<writing_rules>
- Keep questions and answers as short as humanly possible. Minimum information retrieved per repetition.
- One atomic concept per card. If a concept is complex, split it across multiple cards.
- Questions must be specific and unambiguous, framed to challenge recall and understanding.
- Favor understanding over rote facts: where useful, ask WHY/HOW (cause, consequence, reasoning), not only WHAT.
- Use simple, direct language.
- Write the question, answer, and explanation in the SAME LANGUAGE as the source document.
</writing_rules>

<math_and_formatting>
- Write all mathematical formulas, symbols, and equations in LaTeX.
- Use $ ... $ for inline math and $$ ... $$ for display math.
- CRITICAL — because the output is JSON, every backslash in LaTeX MUST be doubled.
  Example: to render \\frac you must write \\\\frac, for \\sqrt write \\\\sqrt, for \\pm write \\\\pm.
- Incomplete or malformed formulas are tolerated by the renderer, but still aim for valid LaTeX.
</math_and_formatting>

<exclusions>
Do NOT create cards for:
- self-explanatory or trivially obvious concepts;
- things easy enough to memorize on the spot;
- sets, lists, or enumerations as a single card (e.g. "list all the steps"); break the useful ones into atomic cards instead, or skip if not meaningful.
Do NOT create vague questions, do NOT overload a card with multiple concepts, and do NOT add mnemonics or hints unless they clearly aid retention.
</exclusions>

<output_format>
Output ONLY the JSON deck and NOTHING else — no preamble, no commentary, no text before or after.
Wrap the entire JSON object in a single fenced code block, starting with \`\`\`json on its own line and ending with \`\`\` on its own line, so it renders as clean, ready-to-copy code.
Schema (a single object with deck metadata and a "cards" array):
\`\`\`json
{"name":"...","description":"...","cards":[{"question":"...","answer":"...","explanation":"..."}]}
\`\`\`
- "name": a short, descriptive title for the deck (in the source language).
- "description": one sentence summarizing what the deck covers.

JSON validity rules (mandatory):
- Use double quotes for all keys and string values.
- Escape any double quote inside a value as \\".
- Escape any backslash inside a value as \\\\ (this is what makes LaTeX work).
- No trailing commas, no comments, no line breaks inside string values (use \\\\n only if truly needed).
- The content inside the code block must be directly parseable and importable as-is.
</output_format>

<examples>
\`\`\`json
{
  "name": "Dead Sea & Quadratic Formula",
  "description": "Key facts about the Dead Sea and the quadratic formula.",
  "cards": [
    {
      "question": "Where is the Dead Sea located?",
      "answer": "On the border between Israel and Jordan",
      "explanation": "The Dead Sea is a salt lake in the Jordan Rift Valley, bordered by Israel to the west and Jordan to the east."
    },
    {
      "question": "Why does the Dead Sea keep swimmers afloat?",
      "answer": "Its very high salt content",
      "explanation": "About 30% of its volume is salt (roughly seven times saltier than the ocean), which raises the water's density above that of the human body, so buoyancy exceeds body weight and swimmers float."
    },
    {
      "question": "In the quadratic formula, why can $a$ not equal 0?",
      "answer": "It causes division by zero and removes the squared term",
      "explanation": "The formula is $$x = \\\\frac{-b \\\\pm \\\\sqrt{b^2 - 4ac}}{2a}$$ If $a = 0$, the denominator $2a$ becomes 0 (undefined), and the $ax^2$ term vanishes, leaving a linear equation instead of a quadratic one."
    }
  ]
}
\`\`\`
</examples>

<process>
1. Read and fully understand ALL the provided material first.
2. Go through it section by section and identify every concept worth a card.
3. For each, write an atomic question, the shortest correct answer, and a clear explanation of why it is correct.
4. Split complex concepts into multiple cards.
5. Do all reasoning internally. Your final reply must be ONLY the fenced \`\`\`json code block — nothing before or after it.
</process>`;
