const { parseMistralResponse } = require("../parseResponse");

const good = `
{
  "causes": ["assignment", "no sleep", "overthinking"],
  "moodScore": 40,
  "energyScore": 30,
  "stressScore": 70,
  "solution": "Take rest and plan tasks."
}
`;

const bad = `THIS IS NOT JSON`;

console.log("GOOD:", parseMistralResponse(good));
console.log("BAD:", parseMistralResponse(bad));
