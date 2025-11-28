import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import {
  users,
  occurrences,
  messages,
  statusHistory,
  occurrenceMedia,
  type User,
  type Occurrence,
  type Message,
  type StatusHistory,
  type OccurrenceMedia,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByMatricula(matricula: string, instituicao: string): Promise<User | undefined>;
  createUser(user: Omit<User, "id" | "createdAt">): Promise<User>;

  getOccurrence(id: string): Promise<Occurrence | undefined>;
  getOccurrenceByCode(codigo: string): Promise<Occurrence | undefined>;
  getOccurrencesByCidadao(cidadaoId: string): Promise<Occurrence[]>;
  getOccurrencesByInstituicao(instituicao: string): Promise<Occurrence[]>;
  createOccurrence(occurrence: Omit<Occurrence, "id" | "codigo" | "createdAt" | "updatedAt">): Promise<Occurrence>;
  updateOccurrenceStatus(id: string, status: string): Promise<Occurrence | undefined>;

  getMessages(occurrenceId: string): Promise<Message[]>;
  createMessage(message: Omit<Message, "id" | "createdAt">): Promise<Message>;

  getStatusHistory(occurrenceId: string): Promise<StatusHistory[]>;
  createStatusHistory(history: Omit<StatusHistory, "id" | "createdAt">): Promise<StatusHistory>;

  getMediaByOccurrence(occurrenceId: string): Promise<OccurrenceMedia[]>;
  createMedia(media: Omit<OccurrenceMedia, "id" | "createdAt">): Promise<OccurrenceMedia>;
}

function generateOccurrenceCode(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  return `BO-${year}-${random}`;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByMatricula(matricula: string, instituicao: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.matricula, matricula), eq(users.instituicao, instituicao as any)))
      .limit(1);
    return result[0];
  }

  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getOccurrence(id: string): Promise<Occurrence | undefined> {
    const result = await db.select().from(occurrences).where(eq(occurrences.id, id)).limit(1);
    return result[0];
  }

  async getOccurrenceByCode(codigo: string): Promise<Occurrence | undefined> {
    const result = await db.select().from(occurrences).where(eq(occurrences.codigo, codigo)).limit(1);
    return result[0];
  }

  async getOccurrencesByCidadao(cidadaoId: string): Promise<Occurrence[]> {
    return db
      .select()
      .from(occurrences)
      .where(eq(occurrences.cidadaoId, cidadaoId))
      .orderBy(desc(occurrences.createdAt));
  }

  async getOccurrencesByInstituicao(instituicao: string): Promise<Occurrence[]> {
    return db
      .select()
      .from(occurrences)
      .where(eq(occurrences.tipoEmergencia, instituicao as any))
      .orderBy(desc(occurrences.createdAt));
  }

  async createOccurrence(occurrence: Omit<Occurrence, "id" | "codigo" | "createdAt" | "updatedAt">): Promise<Occurrence> {
    const codigo = generateOccurrenceCode();
    const result = await db
      .insert(occurrences)
      .values({ ...occurrence, codigo })
      .returning();
    return result[0];
  }

  async updateOccurrenceStatus(id: string, status: string): Promise<Occurrence | undefined> {
    const result = await db
      .update(occurrences)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(occurrences.id, id))
      .returning();
    return result[0];
  }

  async getMessages(occurrenceId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.occurrenceId, occurrenceId))
      .orderBy(messages.createdAt);
  }

  async createMessage(message: Omit<Message, "id" | "createdAt">): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async getStatusHistory(occurrenceId: string): Promise<StatusHistory[]> {
    return db
      .select()
      .from(statusHistory)
      .where(eq(statusHistory.occurrenceId, occurrenceId))
      .orderBy(desc(statusHistory.createdAt));
  }

  async createStatusHistory(history: Omit<StatusHistory, "id" | "createdAt">): Promise<StatusHistory> {
    const result = await db.insert(statusHistory).values(history).returning();
    return result[0];
  }

  async getMediaByOccurrence(occurrenceId: string): Promise<OccurrenceMedia[]> {
    return db.select().from(occurrenceMedia).where(eq(occurrenceMedia.occurrenceId, occurrenceId));
  }

  async createMedia(media: Omit<OccurrenceMedia, "id" | "createdAt">): Promise<OccurrenceMedia> {
    const result = await db.insert(occurrenceMedia).values(media).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
