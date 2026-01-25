from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import torch
import json

model_name = "microsoft/Phi-3-mini-4k-instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",   
    torch_dtype=torch.float16, 
)
generator = pipeline( "text-generation",
    model=model,
    tokenizer=tokenizer,
    max_length=512, )



def analyze_journal(journal_entry:str):
    """
    Input: journal_entry (string)
    Output: JSON with emotion, causes, moodScore, energyScore, stressScore, suggestion
    """
    prompt = f"""
You are a personal mood coach AI.
Analyze the following journal entry and output ONLY JSON in this format:
{{
  "detected_emotions": [],
  "detected_causes": [],
  "moodScore": 0,
  "energyScore": 0,
  "stressScore": 0,
  "suggestion": ""
}}

Journal entry:
\"{journal_entry}\"
"""


    output = generator(prompt)[0]['generated_text']
    
    # Try to parse JSON from output
    try:
        result = json.loads(output)
    except json.JSONDecodeError:
        result = {"raw_output": output}
    
    return result