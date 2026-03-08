import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { openai } from "./replit_integrations/image/client";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // -- Study Sessions API --

  app.get(api.sessions.list.path, async (req, res) => {
    try {
      const sessions = await storage.getStudySessions();
      res.json(sessions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch study sessions" });
    }
  });

  app.get(api.sessions.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const session = await storage.getStudySession(id);
      if (!session) {
        return res.status(404).json({ message: "Study session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch study session" });
    }
  });

  app.post(api.sessions.create.path, async (req, res) => {
    try {
      const input = api.sessions.create.input.parse(req.body);
      
      // 1. Generate Summary and Key Points using OpenAI via Replit AI Integrations
      const summaryResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini", 
        messages: [
          { role: "system", content: "You are a helpful learning assistant. Summarize the following text briefly and extract 3-5 key points. Respond in JSON format with exactly these keys: 'summary' (string) and 'keyPoints' (array of strings)." },
          { role: "user", content: input.originalContent }
        ],
        response_format: { type: "json_object" }
      });
      
      const summaryContent = JSON.parse(summaryResponse.choices[0]?.message?.content || "{}");
      
      // 2. Generate Quiz Questions
      const quizResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful learning assistant. Generate 5 multiple-choice quiz questions based on the following text to test the user's understanding. Respond in JSON format with exactly this key: 'quizQuestions' which is an array of objects. Each object should have 'question' (string), 'options' (array of 4 strings), and 'answer' (string matching one of the options)." },
          { role: "user", content: input.originalContent }
        ],
        response_format: { type: "json_object" }
      });
      
      const quizContent = JSON.parse(quizResponse.choices[0]?.message?.content || "{}");

      // Save to database
      const sessionData = {
        ...input,
        summary: summaryContent.summary || "Summary not available.",
        keyPoints: summaryContent.keyPoints || [],
        quizQuestions: quizContent.quizQuestions || []
      };

      const session = await storage.createStudySession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0]?.message || "Validation Error",
          field: error.errors[0]?.path.join('.')
        });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error while generating study notes." });
    }
  });

  app.delete(api.sessions.delete.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      await storage.deleteStudySession(id);
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete session" });
    }
  });


  // -- Concept Explainer API --

  app.get(api.concepts.list.path, async (req, res) => {
    try {
      const concepts = await storage.getConceptExplanations();
      res.json(concepts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch concepts" });
    }
  });

  app.post(api.concepts.create.path, async (req, res) => {
    try {
      const input = api.concepts.create.input.parse(req.body);

      // Generate ELI5 explanation and analogy
      const explanationResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a concept explainer. Explain the complex term like the user is 5 years old (ELI5). Also provide a real-world analogy. Respond in JSON format with exactly two keys: 'explanation' (string) and 'analogy' (string)." },
          { role: "user", content: `Explain the concept: ${input.term}` }
        ],
        response_format: { type: "json_object" }
      });

      const generatedContent = JSON.parse(explanationResponse.choices[0]?.message?.content || "{}");

      const conceptData = {
        ...input,
        explanation: generatedContent.explanation || "No explanation available.",
        analogy: generatedContent.analogy || "No analogy available."
      };

      const concept = await storage.createConceptExplanation(conceptData);
      res.status(201).json(concept);
    } catch (error) {
       if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0]?.message || "Validation Error",
          field: error.errors[0]?.path.join('.')
        });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error while generating explanation." });
    }
  });

  // Seed DB Function
  async function seedDatabase() {
    try {
      const sessions = await storage.getStudySessions();
      if (sessions.length === 0) {
        await storage.createStudySession({
          title: "Introduction to Thermodynamics",
          topic: "Physics",
          originalContent: "Thermodynamics is the branch of physics that deals with heat, work, and temperature, and their relation to energy, radiation, and physical properties of matter.",
          difficulty: 3,
          summary: "Thermodynamics studies how heat, work, and temperature relate to energy and matter.",
          keyPoints: ["Branch of physics", "Deals with heat, work, temperature", "Relates to energy and matter"],
          quizQuestions: [
            {
              question: "What does thermodynamics study?",
              options: ["Biology", "Heat, work, and temperature", "Quantum mechanics", "Astrophysics"],
              answer: "Heat, work, and temperature"
            }
          ]
        });
        console.log("Seeded default study session");
      }

      const concepts = await storage.getConceptExplanations();
      if (concepts.length === 0) {
         await storage.createConceptExplanation({
           term: "Photosynthesis",
           explanation: "It's how plants make their own food using sunlight, water, and air.",
           analogy: "Think of it like a plant baking a cake. The sunlight is the oven, and the water and air are the ingredients!"
         });
         console.log("Seeded default concept explanation");
      }
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }

  // Run seed
  seedDatabase();

  return httpServer;
}
