import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import Home from "@/pages/Home";
import CidadaoPanel from "@/pages/CidadaoPanel";
import AtendentePanel from "@/pages/AtendentePanel";
import {
  loginCidadao,
  loginAtendente,
  registerCidadao,
  registerAtendente,
  logout,
  getStoredUser,
  isAuthenticated,
  type User,
} from "@/lib/api";

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser && isAuthenticated()) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const handleLoginCidadao = async (email: string, password: string) => {
    try {
      const result = await loginCidadao(email, password);
      setUser(result.user);
      toast({
        title: "Login realizado",
        description: "Bem-vindo ao BO.Militar",
      });
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleLoginAtendente = async (instituicao: string, matricula: string, password: string) => {
    try {
      const result = await loginAtendente(instituicao, matricula, password);
      setUser(result.user);
      toast({
        title: "Login realizado",
        description: "Bem-vindo ao BO.Militar",
      });
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleRegisterCidadao = async (data: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
    password: string;
  }) => {
    try {
      const result = await registerCidadao(data);
      setUser(result.user);
      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível criar a conta",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleRegisterAtendente = async (data: {
    nome: string;
    instituicao: string;
    matricula: string;
    telefone: string;
    email: string;
    password: string;
  }) => {
    try {
      const result = await registerAtendente(data);
      setUser(result.user);
      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível criar a conta",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    queryClient.clear();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Home
        onLoginCidadao={handleLoginCidadao}
        onLoginAtendente={handleLoginAtendente}
        onRegisterCidadao={handleRegisterCidadao}
        onRegisterAtendente={handleRegisterAtendente}
      />
    );
  }

  if (user.type === "cidadao") {
    return (
      <CidadaoPanel
        userName={user.nome}
        userId={user.id}
        onLogout={handleLogout}
      />
    );
  }

  if (user.type === "atendente" && user.instituicao && user.matricula) {
    return (
      <AtendentePanel
        nome={user.nome}
        matricula={user.matricula}
        instituicao={user.instituicao}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
