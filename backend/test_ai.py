from app.ai_assistant import get_ai_suggestion

# Test various questions
test_questions = [
    "How do I reset my password?",
    "What are the system requirements?",
    "How to get started with this platform?",
    "Random question that won't match anything specific"
]

for question in test_questions:
    print(f"\n{'='*60}")
    print(f"Question: {question}")
    print(f"{'='*60}")
    
    result = get_ai_suggestion(question)
    if result:
        print(f"✅ AI Suggestion Found!")
        print(f"Confidence: {int(result['confidence'] * 100)}%")
        print(f"Answer: {result['answer'][:100]}...")
    else:
        print("❌ No suggestion available")
