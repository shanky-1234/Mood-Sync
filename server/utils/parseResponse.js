const clampScore = (value)=>{
    if(typeof value !== 'number' || Number.isNaN(value)){
        return 50
    }
    return Math.min(100,Math.max(0,Math.round(value)))
}

const normalizeCause = (causes) => {
     if (!Array.isArray(causes)) {
    return ["general stress", "overthinking", "fatigue"];
  }

  const cleaned = causes
    .filter(c => typeof c === "string" && c.trim().length > 0)
    .map(c => c.toLowerCase().trim())
    .slice(0, 3);

  // Ensure exactly 3
  while (cleaned.length < 3) {
    cleaned.push("general stress");
  }

  return cleaned;
}

const parseMistralResponse = (rawResponse) =>{
    try{
    const cleaned = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(cleaned)

    return {
        causes:normalizeCause(parsed.causes),
        moodScore:clampScore(parsed.moodScore),
        energyScore:clampScore(parsed.energyScore),
        stressScore:clampScore(parsed.stressScore),
        solution:
           typeof parsed.solution === "string" && parsed.solution.trim().length > 0
          ? parsed.solution.trim()
          : "Take a short break and focus on rest."
    }
    }
    catch (error){
        return {
      causes: ["general stress", "overthinking", "fatigue"],
      moodScore: 50,
      energyScore: 50,
      stressScore: 50,
      solution: "Take a short break and breathe deeply."
    };
    }
}

module.exports = {parseMistralResponse}