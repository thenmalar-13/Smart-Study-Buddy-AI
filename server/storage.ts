import {
  studySessions,
  conceptExplanations,
  type StudySession,
  type InsertStudySession,
  type ConceptExplanation,
  type InsertConceptExplanation,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Study Sessions
  getStudySessions(): Promise<StudySession[]>;
  getStudySession(id: number): Promise<StudySession | undefined>;
  createStudySession(session: InsertStudySession & { summary: string, keyPoints: string[], quizQuestions: any[] }): Promise<StudySession>;
  deleteStudySession(id: number): Promise<void>;

  // Concept Explanations
  getConceptExplanations(): Promise<ConceptExplanation[]>;
  createConceptExplanation(explanation: InsertConceptExplanation & { explanation: string, analogy: string }): Promise<ConceptExplanation>;
}

export class DatabaseStorage implements IStorage {
  async getStudySessions(): Promise<StudySession[]> {
    return await db.select().from(studySessions);
  }

  async getStudySession(id: number): Promise<StudySession | undefined> {
    const [session] = await db.select().from(studySessions).where(eq(studySessions.id, id));
    return session;
  }

  async createStudySession(session: InsertStudySession & { summary: string, keyPoints: string[], quizQuestions: any[] }): Promise<StudySession> {
    const [newSession] = await db.insert(studySessions).values(session).returning();
    return newSession;
  }

  async deleteStudySession(id: number): Promise<void> {
    await db.delete(studySessions).where(eq(studySessions.id, id));
  }

  async getConceptExplanations(): Promise<ConceptExplanation[]> {
    return await db.select().from(conceptExplanations);
  }

  async createConceptExplanation(explanation: InsertConceptExplanation & { explanation: string, analogy: string }): Promise<ConceptExplanation> {
    const [newExplanation] = await db.insert(conceptExplanations).values(explanation).returning();
    return newExplanation;
  }
}

export const storage = new DatabaseStorage();
