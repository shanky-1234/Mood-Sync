/**
 * STEP 3: Derive emotional tone and arousal from top emotions
 * Input: [string] (top emotion labels)
 * Output: { tone: string, arousal: string }
 */

const POSITIVE = new Set([
  "admiration",
  "amusement",
  "approval",
  "caring",
  "gratitude",
  "joy",
  "love",
  "optimism",
  "pride",
  "relief",
  "excitement"
]);

const NEGATIVE = new Set([
  "anger",
  "annoyance",
  "disappointment",
  "disapproval",
  "disgust",
  "embarrassment",
  "fear",
  "grief",
  "nervousness",
  "remorse",
  "sadness"
]);

const HIGH_AROUSAL = new Set([
  "anger",
  "fear",
  "excitement",
  "desire",
  "nervousness",
  "surprise"
]);

const LOW_AROUSAL = new Set([
  "sadness",
  "grief",
  "remorse",
  "relief"
]);


function deriveEmotionSignals(topEmotions = []) {
  if (!Array.isArray(topEmotions) || topEmotions.length === 0) {
    return { tone: "neutral", arousal: "medium" };
  }

  let positiveCount = 0;
  let negativeCount = 0;
  let highArousalCount = 0;
  let lowArousalCount = 0;

  for (const emotion of topEmotions) {
    if (POSITIVE.has(emotion)) positiveCount++;
    if (NEGATIVE.has(emotion)) negativeCount++;
    if (HIGH_AROUSAL.has(emotion)) highArousalCount++;
    if (LOW_AROUSAL.has(emotion)) lowArousalCount++;
  }

  // Determine tone
  let tone = "neutral";
  if (positiveCount > negativeCount) tone = "positive";
  else if (negativeCount > positiveCount) tone = "negative";
  else if (positiveCount === negativeCount && positiveCount > 0) tone = "mixed";

  // Determine arousal
  let arousal = "medium";
  if (highArousalCount > lowArousalCount) arousal = "high";
  else if (lowArousalCount > highArousalCount) arousal = "low";

  return { tone, arousal };
}

module.exports = {
  deriveEmotionSignals
};
