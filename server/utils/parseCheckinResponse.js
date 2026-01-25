function parseCheckInResponse(rawResponse) {
  try {
    const cleaned = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (
      typeof parsed.solution === "string" &&
      parsed.solution.trim().length > 0
    ) {
      return {
        solution: parsed.solution.trim()
      };
    }

    throw new Error("Invalid solution format");
  } catch (error) {
    return {
      solution:
        "Take a short pause, breathe deeply, and focus on one small, manageable task."
    };
  }
}

module.exports = { parseCheckInResponse };
