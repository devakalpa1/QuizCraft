import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.genAI = null;
    this.model = null;
    this.initialized = false;
  }

  async initialize() {
    if (!this.apiKey) {
      console.warn('Gemini API key not found. AI features will be disabled.');
      return false;
    }

    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      // Use the model from environment variable or fallback to gemini-1.5-flash
      const modelName = import.meta.env.VITE_AI_MODEL || "gemini-1.5-flash";
      console.log('Attempting to initialize with model:', modelName);
      this.model = this.genAI.getGenerativeModel({ model: modelName });
      
      // Test the model with a simple request
      try {
        const testResult = await this.model.generateContent("Hello");
        const testResponse = await testResult.response;
        console.log('AI model test successful:', testResponse.text().substring(0, 50));
        this.initialized = true;
        console.log(`AI service initialized with model: ${modelName}`);
        return true;
      } catch (testError) {
        console.error('AI model test failed:', testError);
        throw testError;
      }
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      this.initialized = false;
      return false;
    }
  }

  isAvailable() {
    return this.initialized && this.apiKey;
  }

  async generateFlashcardsFromText(text, options = {}) {
    if (!this.isAvailable()) {
      throw new Error('AI service not available');
    }

    const {
      count = 10,
      difficulty = 'medium',
      subject = 'general',
      includeStudyGuide = false
    } = options;

    const prompt = `
Generate ${count} high-quality flashcards from the following text. Focus on key concepts, definitions, and important facts.

Difficulty level: ${difficulty}
Subject area: ${subject}

TEXT:
${text}

Please format your response as a valid JSON object with the following structure:
{
  "flashcards": [
    {
      "term": "Question or concept",
      "definition": "Answer or explanation",
      "difficulty": "easy|medium|hard",
      "category": "category name"
    }
  ],
  ${includeStudyGuide ? `"studyGuide": {
    "summary": "Brief summary of the main concepts",
    "keyPoints": ["point 1", "point 2", "point 3"],
    "studyTips": ["tip 1", "tip 2", "tip 3"]
  },` : ''}
  "metadata": {
    "totalCards": ${count},
    "estimatedStudyTime": "X minutes",
    "difficulty": "${difficulty}",
    "subject": "${subject}"
  }
}

Guidelines:
- Make questions clear and concise
- Provide comprehensive but digestible answers
- Vary question types (definitions, concepts, applications, examples)
- Ensure factual accuracy
- Make flashcards suitable for spaced repetition learning
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (!parsedResponse.flashcards || !Array.isArray(parsedResponse.flashcards)) {
        throw new Error('Invalid flashcards format from AI');
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error generating flashcards:', error);
      throw new Error('Failed to generate flashcards. Please try again.');
    }
  }

  async generateAdaptiveQuestions(studyProgress, flashcards, options = {}) {
    if (!this.isAvailable()) {
      throw new Error('AI service not available');
    }

    const {
      count = 5,
      focusOnWeakAreas = true,
      questionTypes = ['multiple-choice', 'true-false', 'short-answer']
    } = options;

    // Analyze study progress to identify weak areas
    const weakCards = flashcards.filter((card, index) => 
      !studyProgress[index] || studyProgress[index] === 'unknown'
    );

    const cardsToFocus = focusOnWeakAreas && weakCards.length > 0 ? weakCards : flashcards;

    const prompt = `
Generate ${count} adaptive test questions based on the following flashcards and study progress.

FLASHCARDS:
${cardsToFocus.map((card, index) => `${index + 1}. Term: ${card.term}\nDefinition: ${card.definition}`).join('\n\n')}

STUDY PROGRESS CONTEXT:
- Total flashcards: ${flashcards.length}
- Cards marked as known: ${Object.values(studyProgress).filter(s => s === 'known').length}
- Cards needing practice: ${Object.values(studyProgress).filter(s => s === 'unknown').length}
- Focus on weak areas: ${focusOnWeakAreas}

Generate questions with the following types: ${questionTypes.join(', ')}

Format your response as a valid JSON object:
{
  "questions": [
    {
      "id": "unique_id",
      "type": "multiple-choice|true-false|short-answer",
      "question": "The question text",
      "options": ["option1", "option2", "option3", "option4"], // for multiple-choice only
      "correctAnswer": "correct answer",
      "explanation": "Why this is correct",
      "difficulty": "easy|medium|hard",
      "relatedCardIndex": 0,
      "adaptiveReason": "Why this question was selected"
    }
  ],
  "adaptiveAnalysis": {
    "focusAreas": ["area1", "area2"],
    "recommendations": ["recommendation1", "recommendation2"],
    "estimatedAccuracy": "percentage"
  }
}

Guidelines:
- Create questions that test understanding, not just memorization
- Vary difficulty based on user's demonstrated knowledge
- Include plausible distractors for multiple-choice questions
- Provide clear explanations for all answers
- Focus on concepts the user is struggling with
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        throw new Error('Invalid questions format from AI');
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error generating adaptive questions:', error);
      throw new Error('Failed to generate adaptive questions. Please try again.');
    }
  }

  async generateStudyRecommendations(studyProgress, flashcards, testResults = []) {
    if (!this.isAvailable()) {
      throw new Error('AI service not available');
    }

    const totalCards = flashcards.length;
    const knownCards = Object.values(studyProgress).filter(s => s === 'known').length;
    const unknownCards = Object.values(studyProgress).filter(s => s === 'unknown').length;
    const unstudiedCards = totalCards - Object.keys(studyProgress).length;

    const prompt = `
Analyze the following study data and provide personalized learning recommendations:

STUDY STATISTICS:
- Total flashcards: ${totalCards}
- Cards marked as known: ${knownCards}
- Cards needing practice: ${unknownCards}
- Unstudied cards: ${unstudiedCards}
- Overall progress: ${Math.round((Object.keys(studyProgress).length / totalCards) * 100)}%

RECENT TEST RESULTS:
${testResults.length > 0 ? testResults.map(result => 
  `- Score: ${result.score}%, Time: ${result.timeSpent}s, Areas of difficulty: ${result.incorrectAreas?.join(', ') || 'None'}`
).join('\n') : 'No recent test data available'}

FLASHCARD CONTENT OVERVIEW:
${flashcards.slice(0, 10).map((card, index) => 
  `${index + 1}. ${card.term} (Status: ${studyProgress[index] || 'unstudied'})`
).join('\n')}

Generate personalized recommendations in JSON format:
{
  "studyPlan": {
    "recommendedStudyTime": "X minutes per day",
    "sessionStructure": "Suggested approach for each study session",
    "priorityAreas": ["area1", "area2", "area3"]
  },
  "learningStrategies": [
    {
      "strategy": "Strategy name",
      "description": "How to implement this strategy",
      "suitableFor": "What type of learner this helps"
    }
  ],
  "adaptiveFeedback": {
    "strengths": ["strength1", "strength2"],
    "improvementAreas": ["area1", "area2"],
    "motivationalMessage": "Encouraging message based on progress"
  },
  "nextSteps": [
    "Specific action item 1",
    "Specific action item 2",
    "Specific action item 3"
  ]
}

Provide actionable, encouraging, and personalized recommendations.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating study recommendations:', error);
      throw new Error('Failed to generate study recommendations. Please try again.');
    }
  }

  async improveFlashcard(flashcard, userFeedback = '') {
    if (!this.isAvailable()) {
      throw new Error('AI service not available');
    }

    const prompt = `
Improve the following flashcard based on learning science principles and user feedback:

CURRENT FLASHCARD:
Term: ${flashcard.term}
Definition: ${flashcard.definition}

USER FEEDBACK: ${userFeedback || 'No specific feedback provided'}

Please provide an improved version in JSON format:
{
  "improvedCard": {
    "term": "Improved question/term",
    "definition": "Improved answer/definition",
    "improvements": ["what was improved", "why it's better"],
    "learningTips": ["memory aid 1", "memory aid 2"]
  },
  "alternatives": [
    {
      "term": "Alternative phrasing 1",
      "definition": "Alternative explanation 1"
    },
    {
      "term": "Alternative phrasing 2", 
      "definition": "Alternative explanation 2"
    }
  ]
}

Focus on:
- Clarity and precision
- Memory aids and mnemonics
- Multiple learning pathways
- Addressing user feedback
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error improving flashcard:', error);
      throw new Error('Failed to improve flashcard. Please try again.');
    }
  }

  async generateFlashcardsFromDocument(file, options = {}) {
    if (!this.isAvailable()) {
      throw new Error('AI service not available');
    }

    const {
      count = 15,
      difficulty = 'medium',
      subject = 'general'
    } = options;

    try {
      // Convert file to generative part for Gemini
      const fileData = await this.fileToGenerativePart(file);
      
      const prompt = `
Analyze this document and create ${count} educational flashcards from its content.

Requirements:
- Difficulty level: ${difficulty}
- Subject area: ${subject}
- Extract key concepts, definitions, and important facts
- Create clear, concise questions and comprehensive answers
- Focus on the most important information for learning
- Ensure variety in question types (definitions, explanations, applications)

Format your response as a JSON array:
[
  {
    "term": "Question or key term",
    "definition": "Answer or definition"
  }
]

Only return the JSON array, no other text.
      `;

      const result = await this.model.generateContent([prompt, fileData]);
      const response = await result.response;
      const text = response.text();
      
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }
      
      const flashcards = JSON.parse(jsonMatch[0]);
      
      if (!Array.isArray(flashcards)) {
        throw new Error('Expected an array of flashcards');
      }
      
      return flashcards;
    } catch (error) {
      console.error('Error generating flashcards from document:', error);
      throw new Error('Failed to generate flashcards from document');
    }
  }

  /**
   * Convert file to generative part for Gemini API
   */
  async fileToGenerativePart(file) {
    const base64EncodedData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: base64EncodedData,
        mimeType: file.type,
      },
    };
  }

  async generateStudyGuide(studySet, userProgress = {}) {
    if (!this.isAvailable()) {
      throw new Error('AI service not available');
    }

    const prompt = `
Create a comprehensive study guide for this flashcard set.

Study Set: ${studySet.title}
Flashcards: ${JSON.stringify(studySet.cards)}

Create a study guide that includes:
1. Overview of key concepts
2. Detailed explanations of important topics
3. Memory techniques and mnemonics
4. Practice questions with answers
5. Study tips specific to this content
6. Common mistakes to avoid
7. Connections between concepts

Format as JSON:
{
  "title": "Study Guide Title",
  "overview": "Brief overview of the topic",
  "keyPoints": [
    {
      "concept": "Key concept",
      "explanation": "Detailed explanation",
      "memoryTip": "Mnemonic or memory technique"
    }
  ],
  "practiceQuestions": [
    {
      "question": "Practice question",
      "answer": "Detailed answer"
    }
  ],
  "studyTips": ["Tip 1", "Tip 2", "Tip 3"],
  "commonMistakes": ["Mistake 1", "Mistake 2"],
  "conceptConnections": [
    {
      "concepts": ["Concept A", "Concept B"],
      "relationship": "How they relate"
    }
  ]
}

Only return the JSON object.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }
      
      const studyGuide = JSON.parse(jsonMatch[0]);
      return studyGuide;
    } catch (error) {
      console.error('Error generating study guide:', error);
      throw new Error('Failed to generate study guide');
    }
  }
}

export const aiService = new AIService();
export default aiService;
