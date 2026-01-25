function buildCheckInPrompt({
  moodScore,
  energyScore,
  emotions,
  causes,
  customNotes
}) {
  return `
You are a mental wellness assistant.

The user has completed a daily mental health check-in.
All emotions, causes, and scores are user-provided.
DO NOT analyze or change them.

Your task:
- Provide ONE short, practical, and supportive suggestion
- Tailored to the user's mood, energy, emotions, and causes
- Maximum 60 words

User data:
- Mood score (0–100): ${moodScore}
- Energy score (0–100): ${energyScore}
- Emotions: ${emotions.join(", ")}
- Causes: ${causes.join(", ")}
- Additional notes: ${customNotes && customNotes.trim() ? customNotes : "None"}

IMPORTANT RULES:
- Output ONLY valid JSON
- Do NOT include explanations
- Do NOT include extra text
- Do NOT include emojis

Return JSON in this exact format:
{
  "solution": "one short actionable suggestion"
}
`;
}

module.exports = { buildCheckInPrompt };
