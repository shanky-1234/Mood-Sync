const { preProcessText} = require("../preprocessText");
const { emotionAnalysis } = require("../emotionAnalysis");
const { deriveEmotionSignals } = require("../deriveEmotionAnalysis");

const fakeEmotionOutput = [[
  { label: "anger", score: 0.7 },
  { label: "sadness", score: 0.5 },
  { label: "optimism", score: 0.4 }
]];

const clean = preProcessText("  I am tired   and angry \n ");
const top = emotionAnalysis(fakeEmotionOutput);
const signals = deriveEmotionSignals(top);

console.log({ clean, top, signals });
