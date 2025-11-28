import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import {
  hashPassword,
  comparePassword,
  generateToken,
  authMiddleware,
  requireCidadao,
  requireAtendente,
  type AuthenticatedRequest,
} from "./auth";
import {
  loginCidadaoSchema,
  loginAtendenteSchema,
  registerCidadaoSchema,
  registerAtendenteSchema,
  createOccurrenceSchema,
  updateStatusSchema,
  sendMessageSchema,
} from "@shared/schema";
import {
  getGitHubUser,
  listRepositories,
  createRepository,
  pushToRepository,
} from "./github";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não permitido"));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/auth/cidadao/register", async (req, res) => {
    try {
      const data = registerCidadaoSchema.parse(req.body);
      
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({
        type: "cidadao",
        nome: data.nome,
        email: data.email,
        password: hashedPassword,
        cpf: data.cpf,
        telefone: data.telefone,
        matricula: null,
        instituicao: null,
      });

      const token = generateToken(user);
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Erro ao registrar" });
    }
  });

  app.post("/api/auth/cidadao/login", async (req, res) => {
    try {
      const data = loginCidadaoSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(data.email);
      if (!user || user.type !== "cidadao") {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const valid = await comparePassword(data.password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = generateToken(user);
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Erro ao fazer login" });
    }
  });

  app.post("/api/auth/atendente/register", async (req, res) => {
    try {
      const data = registerAtendenteSchema.parse(req.body);
      
      const existing = await storage.getUserByMatricula(data.matricula, data.instituicao);
      if (existing) {
        return res.status(400).json({ message: "Matrícula já cadastrada" });
      }

      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({
        type: "atendente",
        nome: data.nome,
        email: data.email,
        password: hashedPassword,
        cpf: null,
        telefone: data.telefone,
        matricula: data.matricula,
        instituicao: data.instituicao,
      });

      const token = generateToken(user);
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Erro ao registrar" });
    }
  });

  app.post("/api/auth/atendente/login", async (req, res) => {
    try {
      const data = loginAtendenteSchema.parse(req.body);
      
      const user = await storage.getUserByMatricula(data.matricula, data.instituicao);
      if (!user || user.type !== "atendente") {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const valid = await comparePassword(data.password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = generateToken(user);
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Erro ao fazer login" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/occurrences", authMiddleware, requireCidadao, async (req: AuthenticatedRequest, res) => {
    try {
      const data = createOccurrenceSchema.parse(req.body);
      
      const occurrence = await storage.createOccurrence({
        cidadaoId: req.user!.userId,
        tipoEmergencia: data.tipoEmergencia,
        tipoOcorrencia: data.tipoOcorrencia,
        status: "aguardando",
        descricao: data.descricao,
        endereco: data.endereco,
        latitude: data.latitude.toString(),
        longitude: data.longitude.toString(),
      });

      await storage.createStatusHistory({
        occurrenceId: occurrence.id,
        userId: req.user!.userId,
        previousStatus: null,
        newStatus: "aguardando",
        observacao: "Ocorrência registrada pelo cidadão",
      });

      await storage.createMessage({
        occurrenceId: occurrence.id,
        senderId: null,
        role: "sistema",
        content: "Ocorrência registrada com sucesso. Aguardando atendimento.",
      });

      res.status(201).json(occurrence);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Erro ao criar ocorrência" });
    }
  });

  app.post("/api/occurrences/:id/media", authMiddleware, upload.array("files", 5), async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const occurrence = await storage.getOccurrence(id);
      
      if (!occurrence) {
        return res.status(404).json({ message: "Ocorrência não encontrada" });
      }

      if (req.user!.type === "cidadao" && occurrence.cidadaoId !== req.user!.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      const files = req.files as Express.Multer.File[];
      const mediaRecords = [];

      for (const file of files) {
        const media = await storage.createMedia({
          occurrenceId: id,
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        });
        mediaRecords.push(media);
      }

      res.json(mediaRecords);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Erro ao enviar arquivos" });
    }
  });

  app.get("/api/occurrences", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      let occurrences;
      
      if (req.user!.type === "cidadao") {
        occurrences = await storage.getOccurrencesByCidadao(req.user!.userId);
      } else {
        occurrences = await storage.getOccurrencesByInstituicao(req.user!.instituicao!);
      }

      const enriched = await Promise.all(
        occurrences.map(async (occ) => {
          const cidadao = await storage.getUser(occ.cidadaoId);
          return {
            ...occ,
            cidadao: cidadao ? { 
              id: cidadao.id,
              nome: cidadao.nome, 
              telefone: cidadao.telefone 
            } : null,
          };
        })
      );

      res.json(enriched);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/occurrences/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const occurrence = await storage.getOccurrence(id);
      
      if (!occurrence) {
        return res.status(404).json({ message: "Ocorrência não encontrada" });
      }

      if (req.user!.type === "cidadao" && occurrence.cidadaoId !== req.user!.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      if (req.user!.type === "atendente" && occurrence.tipoEmergencia !== req.user!.instituicao) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      const [cidadao, media, statusHist] = await Promise.all([
        storage.getUser(occurrence.cidadaoId),
        storage.getMediaByOccurrence(id),
        storage.getStatusHistory(id),
      ]);

      res.json({
        ...occurrence,
        cidadao: cidadao ? { 
          id: cidadao.id,
          nome: cidadao.nome, 
          telefone: cidadao.telefone,
          cpf: cidadao.cpf,
        } : null,
        media,
        statusHistory: statusHist,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/occurrences/:id/status", authMiddleware, requireAtendente, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const data = updateStatusSchema.parse(req.body);
      
      const occurrence = await storage.getOccurrence(id);
      if (!occurrence) {
        return res.status(404).json({ message: "Ocorrência não encontrada" });
      }

      if (occurrence.tipoEmergencia !== req.user!.instituicao) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      const previousStatus = occurrence.status;
      const updated = await storage.updateOccurrenceStatus(id, data.status);

      await storage.createStatusHistory({
        occurrenceId: id,
        userId: req.user!.userId,
        previousStatus,
        newStatus: data.status,
        observacao: data.observacao || null,
      });

      const statusMessages: Record<string, string> = {
        despachado: "Equipe despachada para o local.",
        atendimento: "Equipe chegou ao local e iniciou atendimento.",
        concluido: "Ocorrência concluída.",
      };

      if (statusMessages[data.status]) {
        await storage.createMessage({
          occurrenceId: id,
          senderId: null,
          role: "sistema",
          content: statusMessages[data.status],
        });
      }

      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Erro ao atualizar status" });
    }
  });

  app.get("/api/occurrences/:id/messages", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const occurrence = await storage.getOccurrence(id);
      
      if (!occurrence) {
        return res.status(404).json({ message: "Ocorrência não encontrada" });
      }

      if (req.user!.type === "cidadao" && occurrence.cidadaoId !== req.user!.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      if (req.user!.type === "atendente" && occurrence.tipoEmergencia !== req.user!.instituicao) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      const messages = await storage.getMessages(id);
      
      const enrichedMessages = await Promise.all(
        messages.map(async (msg) => {
          if (msg.senderId) {
            const sender = await storage.getUser(msg.senderId);
            return {
              ...msg,
              senderName: sender?.nome || "Usuário",
            };
          }
          return { ...msg, senderName: "Sistema" };
        })
      );

      res.json(enrichedMessages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/occurrences/:id/messages", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const data = sendMessageSchema.parse(req.body);
      
      const occurrence = await storage.getOccurrence(id);
      if (!occurrence) {
        return res.status(404).json({ message: "Ocorrência não encontrada" });
      }

      if (req.user!.type === "cidadao" && occurrence.cidadaoId !== req.user!.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      if (req.user!.type === "atendente" && occurrence.tipoEmergencia !== req.user!.instituicao) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      const message = await storage.createMessage({
        occurrenceId: id,
        senderId: req.user!.userId,
        role: req.user!.type,
        content: data.content,
      });

      const user = await storage.getUser(req.user!.userId);
      res.status(201).json({
        ...message,
        senderName: user?.nome || "Usuário",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Erro ao enviar mensagem" });
    }
  });

  app.get("/api/stats", authMiddleware, requireAtendente, async (req: AuthenticatedRequest, res) => {
    try {
      const occurrences = await storage.getOccurrencesByInstituicao(req.user!.instituicao!);
      
      const stats = {
        aguardando: occurrences.filter(o => o.status === "aguardando").length,
        atendimento: occurrences.filter(o => o.status === "atendimento" || o.status === "despachado").length,
        concluidos: occurrences.filter(o => o.status === "concluido").length,
        total: occurrences.length,
      };

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.use("/uploads", (req, res, next) => {
    authMiddleware(req as AuthenticatedRequest, res, next);
  }, (req, res) => {
    const filePath = path.join(uploadDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "Arquivo não encontrado" });
    }
  });

  app.get("/api/github/user", async (req, res) => {
    try {
      const user = await getGitHubUser();
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Erro ao obter usuário do GitHub" });
    }
  });

  app.get("/api/github/repos", async (req, res) => {
    try {
      const repos = await listRepositories();
      res.json(repos);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Erro ao listar repositórios" });
    }
  });

  app.post("/api/github/create-repo", async (req, res) => {
    try {
      const { name, description, isPrivate } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Nome do repositório é obrigatório" });
      }
      const repo = await createRepository(name, description, isPrivate);
      res.json(repo);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Erro ao criar repositório" });
    }
  });

  app.post("/api/github/push", async (req, res) => {
    try {
      const { repoName, message } = req.body;
      if (!repoName) {
        return res.status(400).json({ message: "Nome do repositório é obrigatório" });
      }

      const user = await getGitHubUser();
      const owner = user.login;

      const projectRoot = process.cwd();
      const files: { path: string; content: string }[] = [];

      const ignoreDirs = ['node_modules', '.git', 'uploads', 'dist', '.cache', '.replit', '.config'];
      const ignoreFiles = ['.replit', 'replit.nix', '.breakpoints'];

      const walkDir = (dir: string, baseDir: string = '') => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.join(baseDir, entry.name);

          if (entry.isDirectory()) {
            if (!ignoreDirs.includes(entry.name) && !entry.name.startsWith('.')) {
              walkDir(fullPath, relativePath);
            }
          } else if (entry.isFile()) {
            if (!ignoreFiles.includes(entry.name) && !entry.name.startsWith('.')) {
              try {
                const content = fs.readFileSync(fullPath, 'utf-8');
                files.push({ path: relativePath, content });
              } catch (e) {
              }
            }
          }
        }
      };

      walkDir(projectRoot);

      const commit = await pushToRepository(
        owner,
        repoName,
        files,
        message || 'Update from Replit'
      );

      res.json({ 
        success: true, 
        commitSha: commit.sha,
        repoUrl: `https://github.com/${owner}/${repoName}`,
        filesCount: files.length
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Erro ao enviar para o GitHub" });
    }
  });

  return httpServer;
}
