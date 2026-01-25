const { buildMistralPrompt } = require("../utils/aiPrompt");
const { deriveEmotionSignals } = require("../utils/deriveEmotionAnalysis");
const { emotionAnalysis } = require("../utils/emotionAnalysis");
const { parseMistralResponse } = require("../utils/parseResponse");
const { preProcessText } = require("../utils/preprocessText");
const { callGoEmotion } = require("./emotionDetection");
const { callMistral } = require("./mistralAIAnalysis");

const journalAnalysis = async (content) => {
  const cleanText = preProcessText(content);

  const emotionRaw = await callGoEmotion(cleanText);
  const topEmotion = emotionAnalysis(emotionRaw);

  const signals = deriveEmotionSignals(topEmotion);

  const prompt = buildMistralPrompt({
    text: cleanText,
    topEmotions: topEmotion,
    tone: signals.tone,
    arousal: signals.arousal
  });

  const modelOutput = await callMistral(prompt);

  const parsed =  parseMistralResponse(modelOutput);

  return {
  emotion: topEmotion, // <-- YOU ALREADY HAVE THIS
  causes: parsed.causes,
  scores: {
    moodScore: parsed.moodScore,
    energyScore: parsed.energyScore,
    stressScore: parsed.stressScore
  },
  solution: parsed.solution,
  analysisDate: new Date()
};

};

module.exports = { journalAnalysis };
