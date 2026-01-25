const {buildCheckInPrompt} = require("../utils/checkinPrompt");
const {parseCheckInResponse} = require("../utils/parseCheckinResponse");
const {callMistral} = require("./mistralAIAnalysis");

const normalizeList = (baseArray, customValue) => {
  const result = [];

  if (Array.isArray(baseArray)) {
    result.push(...baseArray);
  }

  if (typeof customValue === "string" && customValue.trim()) {
    result.push(customValue.trim());
  }

  return result.slice(0, 4); // max 4
};

const checkinAnalysis = async ({
  moodScore,
  energyScore,
  emotions,
  emotionCustom,
  causes,
  causesCustom,
  customNotes,
}) => {
  if (typeof moodScore !== "number" || typeof energyScore !== "number") {
    console.error("Invalid Input");
  }

  const finalEmotions = normalizeList(emotions, emotionCustom);
  const finalCause = normalizeList(causes, causesCustom);

  if (finalEmotions.length < 1 || finalCause.length < 1) {
    throw new Error("At least one emotion and one cause required");
  }

  const prompt = buildCheckInPrompt({
    moodScore,
    energyScore,
    emotions: finalEmotions,
    causes: finalCause,
    customNotes,
  });

  const mistral = await callMistral(prompt);
  const parsed = await parseCheckInResponse(mistral);

  return {
    solution: parsed.solution,
    analysisDate: new Date(),
    modelVersion: "mistral-medium-latest",
  };
};

module.exports = { checkinAnalysis };
