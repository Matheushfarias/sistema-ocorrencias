import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userTypeEnum = pgEnum("user_type", ["cidadao", "atendente"]);
export const institutionEnum = pgEnum("institution", ["pm", "bombeiros"]);
export const occurrenceStatusEnum = pgEnum("occurrence_status", ["aguardando", "despachado", "atendimento", "concluido"]);
export const messageRoleEnum = pgEnum("message_role", ["cidadao", "atendente", "sistema"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: userTypeEnum("type").notNull(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  cpf: text("cpf"),
  telefone: text("telefone"),
  matricula: text("matricula"),
  instituicao: institutionEnum("instituicao"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const occurrences = pgTable("occurrences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  codigo: text("codigo").notNull().unique(),
  cidadaoId: varchar("cidadao_id").notNull().references(() => users.id),
  tipoEmergencia: institutionEnum("tipo_emergencia").notNull(),
  tipoOcorrencia: text("tipo_ocorrencia").notNull(),
  status: occurrenceStatusEnum("status").notNull().default("aguardando"),
  descricao: text("descricao").notNull(),
  endereco: text("endereco").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 6 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const occurrenceMedia = pgTable("occurrence_media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  occurrenceId: varchar("occurrence_id").notNull().references(() => occurrences.id),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  occurrenceId: varchar("occurrence_id").notNull().references(() => occurrences.id),
  senderId: varchar("sender_id").references(() => users.id),
  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const statusHistory = pgTable("status_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  occurrenceId: varchar("occurrence_id").notNull().references(() => occurrences.id),
  userId: varchar("user_id").references(() => users.id),
  previousStatus: occurrenceStatusEnum("previous_status"),
  newStatus: occurrenceStatusEnum("new_status").notNull(),
  observacao: text("observacao"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertOccurrenceSchema = createInsertSchema(occurrences).omit({
  id: true,
  codigo: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertStatusHistorySchema = createInsertSchema(statusHistory).omit({
  id: true,
  createdAt: true,
});

export const insertMediaSchema = createInsertSchema(occurrenceMedia).omit({
  id: true,
  createdAt: true,
});

export const loginCidadaoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginAtendenteSchema = z.object({
  instituicao: z.enum(["pm", "bombeiros"]),
  matricula: z.string().min(1),
  password: z.string().min(1),
});

export const registerCidadaoSchema = z.object({
  nome: z.string().min(1),
  cpf: z.string().min(11),
  telefone: z.string().min(10),
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerAtendenteSchema = z.object({
  nome: z.string().min(1),
  instituicao: z.enum(["pm", "bombeiros"]),
  matricula: z.string().min(1),
  telefone: z.string().min(10),
  email: z.string().email(),
  password: z.string().min(6),
});

export const createOccurrenceSchema = z.object({
  tipoEmergencia: z.enum(["pm", "bombeiros"]),
  tipoOcorrencia: z.string().min(1),
  descricao: z.string().min(1),
  endereco: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["aguardando", "despachado", "atendimento", "concluido"]),
  observacao: z.string().optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Occurrence = typeof occurrences.$inferSelect;
export type OccurrenceMedia = typeof occurrenceMedia.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type StatusHistory = typeof statusHistory.$inferSelect;
