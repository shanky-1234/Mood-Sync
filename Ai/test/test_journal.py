import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ai_model.journal_analyzer import analyze_journal

# Example journal entries
journals = [
    "I am very sad today because I couldn't complete my project.",
]
# Run AI analysis
for entry in journals:
    result = analyze_journal(entry)
    print("\nJournal:", entry)
    print("AI Analysis:", result)