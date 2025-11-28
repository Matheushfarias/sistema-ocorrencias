import { apiRequest } from "./queryClient";

const TOKEN_KEY = "bomilitar_token";
const USER_KEY = "bomilitar_user";

export interface User {
  id: string;
  type: "cidadao" | "atendente";
  nome: string;
  email: string;
  cpf?: string | null;
  telefone?: string | null;
  matricula?: string | null;
  instituicao?: "pm" | "bombeiros" | null;
}

export interface Occurrence {
  id: string;
  codigo: string;
  cidadaoId: string;
  tipoEmergencia: "pm" | "bombeiros";
  tipoOcorrencia: string;
  status: "aguardando" | "despachado" | "atendimento" | "concluido";
  descricao: string;
  endereco: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
  cidadao?: {
    id: string;
    nome: string;
    telefone: string | null;
    cpf?: string | null;
  };
  media?: Media[];
  statusHistory?: StatusHistory[];
}

export interface Media {
  id: string;
  occurrenceId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface Message {
  id: string;
  occurrenceId: string;
  senderId: string | null;
  role: "cidadao" | "atendente" | "sistema";
  content: string;
  createdAt: string;
  senderName?: string;
}

export interface StatusHistory {
  id: string;
  occurrenceId: string;
  userId: string | null;
  previousStatus: string | null;
  newStatus: string;
  observacao: string | null;
  createdAt: string;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setAuthData(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

export async function loginCidadao(email: string, password: string) {
  const response = await apiRequest("POST", "/api/auth/cidadao/login", { email, password });
  const data = await response.json();
  setAuthData(data.token, data.user);
  return data;
}

export async function registerCidadao(data: {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  password: string;
}) {
  const response = await apiRequest("POST", "/api/auth/cidadao/register", data);
  const result = await response.json();
  setAuthData(result.token, result.user);
  return result;
}

export async function loginAtendente(instituicao: string, matricula: string, password: string) {
  const response = await apiRequest("POST", "/api/auth/atendente/login", { instituicao, matricula, password });
  const data = await response.json();
  setAuthData(data.token, data.user);
  return data;
}

export async function registerAtendente(data: {
  nome: string;
  instituicao: string;
  matricula: string;
  telefone: string;
  email: string;
  password: string;
}) {
  const response = await apiRequest("POST", "/api/auth/atendente/register", data);
  const result = await response.json();
  setAuthData(result.token, result.user);
  return result;
}

export function logout() {
  clearAuthData();
}

export async function createOccurrence(data: {
  tipoEmergencia: "pm" | "bombeiros";
  tipoOcorrencia: string;
  descricao: string;
  endereco: string;
  latitude: number;
  longitude: number;
}) {
  const response = await apiRequest("POST", "/api/occurrences", data);
  return response.json();
}

export async function uploadMedia(occurrenceId: string, files: File[]) {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));
  
  const token = getStoredToken();
  const response = await fetch(`/api/occurrences/${occurrenceId}/media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao enviar arquivos");
  }

  return response.json();
}

export async function getOccurrences(): Promise<Occurrence[]> {
  const response = await apiRequest("GET", "/api/occurrences");
  return response.json();
}

export async function getOccurrence(id: string): Promise<Occurrence> {
  const response = await apiRequest("GET", `/api/occurrences/${id}`);
  return response.json();
}

export async function updateOccurrenceStatus(id: string, status: string, observacao?: string) {
  const response = await apiRequest("PATCH", `/api/occurrences/${id}/status`, { status, observacao });
  return response.json();
}

export async function getMessages(occurrenceId: string): Promise<Message[]> {
  const response = await apiRequest("GET", `/api/occurrences/${occurrenceId}/messages`);
  return response.json();
}

export async function sendMessage(occurrenceId: string, content: string): Promise<Message> {
  const response = await apiRequest("POST", `/api/occurrences/${occurrenceId}/messages`, { content });
  return response.json();
}

export async function getStats() {
  const response = await apiRequest("GET", "/api/stats");
  return response.json();
}
