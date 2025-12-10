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

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private occurrences: Map<string, Occurrence> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private statusHistories: Map<string, StatusHistory[]> = new Map();
  private media: Map<string, OccurrenceMedia[]> = new Map();
  private userIdCounter = 1;
  private occurrenceIdCounter = 1;
  private messageIdCounter = 1;
  private statusHistoryIdCounter = 1;
  private mediaIdCounter = 1;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async getUserByMatricula(matricula: string, instituicao: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.matricula === matricula && u.instituicao === instituicao);
  }

  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const id = String(this.userIdCounter++);
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  async getOccurrence(id: string): Promise<Occurrence | undefined> {
    return this.occurrences.get(id);
  }

  async getOccurrenceByCode(codigo: string): Promise<Occurrence | undefined> {
    return Array.from(this.occurrences.values()).find(o => o.codigo === codigo);
  }

  async getOccurrencesByCidadao(cidadaoId: string): Promise<Occurrence[]> {
    return Array.from(this.occurrences.values()).filter(o => o.cidadaoId === cidadaoId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOccurrencesByInstituicao(instituicao: string): Promise<Occurrence[]> {
    return Array.from(this.occurrences.values()).filter(o => o.tipoEmergencia === instituicao).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createOccurrence(occurrence: Omit<Occurrence, "id" | "codigo" | "createdAt" | "updatedAt">): Promise<Occurrence> {
    const id = String(this.occurrenceIdCounter++);
    const codigo = generateOccurrenceCode();
    const now = new Date();
    const newOccurrence: Occurrence = { ...occurrence, id, codigo, createdAt: now, updatedAt: now };
    this.occurrences.set(id, newOccurrence);
    return newOccurrence;
  }

  async updateOccurrenceStatus(id: string, status: string): Promise<Occurrence | undefined> {
    const occ = this.occurrences.get(id);
    if (!occ) return undefined;
    const updated = { ...occ, status: status as any, updatedAt: new Date() };
    this.occurrences.set(id, updated);
    return updated;
  }

  async getMessages(occurrenceId: string): Promise<Message[]> {
    return this.messages.get(occurrenceId) || [];
  }

  async createMessage(message: Omit<Message, "id" | "createdAt">): Promise<Message> {
    const id = String(this.messageIdCounter++);
    const newMessage: Message = { ...message, id, createdAt: new Date() };
    const msgs = this.messages.get(message.occurrenceId) || [];
    msgs.push(newMessage);
    this.messages.set(message.occurrenceId, msgs);
    return newMessage;
  }

  async getStatusHistory(occurrenceId: string): Promise<StatusHistory[]> {
    return (this.statusHistories.get(occurrenceId) || []).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createStatusHistory(history: Omit<StatusHistory, "id" | "createdAt">): Promise<StatusHistory> {
    const id = String(this.statusHistoryIdCounter++);
    const newHistory: StatusHistory = { ...history, id, createdAt: new Date() };
    const histories = this.statusHistories.get(history.occurrenceId) || [];
    histories.push(newHistory);
    this.statusHistories.set(history.occurrenceId, histories);
    return newHistory;
  }

  async getMediaByOccurrence(occurrenceId: string): Promise<OccurrenceMedia[]> {
    return this.media.get(occurrenceId) || [];
  }

  async createMedia(media: Omit<OccurrenceMedia, "id" | "createdAt">): Promise<OccurrenceMedia> {
    const id = String(this.mediaIdCounter++);
    const newMedia: OccurrenceMedia = { ...media, id, createdAt: new Date() };
    const mediaList = this.media.get(media.occurrenceId) || [];
    mediaList.push(newMedia);
    this.media.set(media.occurrenceId, mediaList);
    return newMedia;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByMatricula(matricula: string, instituicao: string): Promise<User | undefined> {
    if (!db) return undefined;
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.matricula, matricula), eq(users.instituicao, instituicao as any)))
      .limit(1);
    return result[0];
  }

  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    if (!db) return { id: String(Math.random()), ...user, createdAt: new Date() };
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getOccurrence(id: string): Promise<Occurrence | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(occurrences).where(eq(occurrences.id, id)).limit(1);
    return result[0];
  }

  async getOccurrenceByCode(codigo: string): Promise<Occurrence | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(occurrences).where(eq(occurrences.codigo, codigo)).limit(1);
    return result[0];
  }

  async getOccurrencesByCidadao(cidadaoId: string): Promise<Occurrence[]> {
    if (!db) return [];
    return db
      .select()
      .from(occurrences)
      .where(eq(occurrences.cidadaoId, cidadaoId))
      .orderBy(desc(occurrences.createdAt));
  }

  async getOccurrencesByInstituicao(instituicao: string): Promise<Occurrence[]> {
    if (!db) return [];
    return db
      .select()
      .from(occurrences)
      .where(eq(occurrences.tipoEmergencia, instituicao as any))
      .orderBy(desc(occurrences.createdAt));
  }

  async createOccurrence(occurrence: Omit<Occurrence, "id" | "codigo" | "createdAt" | "updatedAt">): Promise<Occurrence> {
    if (!db) {
      const codigo = generateOccurrenceCode();
      const now = new Date();
      return { id: String(Math.random()), ...occurrence, codigo, createdAt: now, updatedAt: now };
    }
    const codigo = generateOccurrenceCode();
    const result = await db
      .insert(occurrences)
      .values({ ...occurrence, codigo })
      .returning();
    return result[0];
  }

  async updateOccurrenceStatus(id: string, status: string): Promise<Occurrence | undefined> {
    if (!db) return undefined;
    const result = await db
      .update(occurrences)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(occurrences.id, id))
      .returning();
    return result[0];
  }

  async getMessages(occurrenceId: string): Promise<Message[]> {
    if (!db) return [];
    return db
      .select()
      .from(messages)
      .where(eq(messages.occurrenceId, occurrenceId))
      .orderBy(messages.createdAt);
  }

  async createMessage(message: Omit<Message, "id" | "createdAt">): Promise<Message> {
    if (!db) {
      return { id: String(Math.random()), ...message, createdAt: new Date() };
    }
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async getStatusHistory(occurrenceId: string): Promise<StatusHistory[]> {
    if (!db) return [];
    return db
      .select()
      .from(statusHistory)
      .where(eq(statusHistory.occurrenceId, occurrenceId))
      .orderBy(desc(statusHistory.createdAt));
  }

  async createStatusHistory(history: Omit<StatusHistory, "id" | "createdAt">): Promise<StatusHistory> {
    if (!db) {
      return { id: String(Math.random()), ...history, createdAt: new Date() };
    }
    const result = await db.insert(statusHistory).values(history).returning();
    return result[0];
  }

  async getMediaByOccurrence(occurrenceId: string): Promise<OccurrenceMedia[]> {
    if (!db) return [];
    return db.select().from(occurrenceMedia).where(eq(occurrenceMedia.occurrenceId, occurrenceId));
  }

  async createMedia(media: Omit<OccurrenceMedia, "id" | "createdAt">): Promise<OccurrenceMedia> {
    if (!db) {
      return { id: String(Math.random()), ...media, createdAt: new Date() };
    }
    const result = await db.insert(occurrenceMedia).values(media).returning();
    return result[0];
  }
}

const memStorage = new MemStorage();
const dbStorage = new DatabaseStorage();
export const storage = db ? dbStorage : memStorage;
