callGoEmotions = async () => [[
  { label: "anger", score: 0.6 },
  { label: "sadness", score: 0.4 }
]];

callMistral = async () => `
{
  "causes": ["assignment", "no sleep", "stress"],
  "moodScore": 35,
  "energyScore": 30,
  "stressScore": 75,
  "solution": "Rest and prioritize."
}
`;

const result = await runJournalAnalysis(
  "I feel overwhelmed with assignments."
);

console.log(result);

