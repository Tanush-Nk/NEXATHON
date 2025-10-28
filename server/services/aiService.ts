import OpenAI from "openai";
import type { Difficulty } from "@shared/schema";

// Using OpenAI's API integration
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
  });
}

export interface GeneratedQuiz {
  question: string;
  options: string[];
  correctAnswer: string;
  topic: string;
  difficulty: Difficulty;
}

export class AIService {
  static async generateChatResponse(
    userMessage: string,
    conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
  ): Promise<string> {
    const openai = getOpenAIClient();
    if (!openai) {
      return "AI service is not configured. Please add your OpenAI API key to use the chat feature.";
    }

    try {
      const messages = [
        {
          role: "system" as const,
          content: "You are an AI learning companion for students. Provide clear, educational explanations to help students understand any topic. Be encouraging and supportive. When appropriate, suggest taking a quiz to test their understanding."
        },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: "user" as const,
          content: userMessage
        }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: messages,
        max_completion_tokens: 2048,
      });

      return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("OpenAI API error:", error);
      return "I'm having trouble connecting to the AI service. Please try again later.";
    }
  }

  static async generateAdaptiveQuiz(
    topic: string,
    difficulty: Difficulty,
    userAccuracy?: number
  ): Promise<GeneratedQuiz> {
    const openai = getOpenAIClient();
    if (!openai) {
      // Return mock quiz when API key is not configured
      return this.getMockQuiz(topic, difficulty);
    }

    try {
      const prompt = `Generate an educational multiple-choice quiz question about ${topic} at ${difficulty} difficulty level.
      
${userAccuracy !== undefined ? `The student's current accuracy is ${userAccuracy}%. Adjust the difficulty accordingly.` : ""}

Respond with JSON in this exact format:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "The exact text of the correct option",
  "explanation": "Brief explanation of why this is correct"
}

Make the question educational and engaging. Ensure the correct answer is one of the provided options.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are an educational AI that generates high-quality quiz questions for students. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 1024,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");

      return {
        question: result.question,
        options: result.options,
        correctAnswer: result.correctAnswer,
        topic,
        difficulty
      };
    } catch (error) {
      console.error("OpenAI quiz generation error:", error);
      return this.getMockQuiz(topic, difficulty);
    }
  }

  private static getMockQuiz(topic: string, difficulty: Difficulty): GeneratedQuiz {
    // Fallback mock quizzes when API is unavailable
    const mockQuizzes: Record<Difficulty, GeneratedQuiz> = {
      easy: {
        question: `What is a fundamental concept in ${topic}?`,
        options: [
          "The basic principle",
          "An advanced technique",
          "A complex theorem",
          "An edge case"
        ],
        correctAnswer: "The basic principle",
        topic,
        difficulty: "easy"
      },
      medium: {
        question: `How would you apply ${topic} in a practical scenario?`,
        options: [
          "By understanding the context first",
          "By ignoring the prerequisites",
          "By memorizing formulas only",
          "By skipping the basics"
        ],
        correctAnswer: "By understanding the context first",
        topic,
        difficulty: "medium"
      },
      hard: {
        question: `What is an advanced application of ${topic}?`,
        options: [
          "Integrating multiple concepts",
          "Repeating basic exercises",
          "Avoiding complex problems",
          "Simplifying everything"
        ],
        correctAnswer: "Integrating multiple concepts",
        topic,
        difficulty: "hard"
      }
    };

    return mockQuizzes[difficulty];
  }

  static adjustDifficulty(currentDifficulty: Difficulty, accuracy: number): Difficulty {
    if (accuracy >= 85 && currentDifficulty === "easy") return "medium";
    if (accuracy >= 85 && currentDifficulty === "medium") return "hard";
    if (accuracy < 60 && currentDifficulty === "hard") return "medium";
    if (accuracy < 60 && currentDifficulty === "medium") return "easy";
    return currentDifficulty;
  }
}
