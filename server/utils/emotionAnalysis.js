const emotionAnalysis = (result,limit=3)=>{
    if(!Array.isArray(result)){
        console.error('Invalid Input')
        return []
    }

    const normalizedResults = Array.isArray(result[0])
  ? result[0]
  : result;

    return(normalizedResults.filter((item)=>
        item && typeof item.label === "string" && typeof item.score === "number").sort((a,b)=>b.score - a.score).slice(0,limit).map((item)=>item.label))
}

module.exports = {emotionAnalysis}