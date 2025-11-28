import { useState } from "react";
import Logo from "@/components/Logo";
import RoleSelector from "@/components/RoleSelector";
import LoginCidadao from "@/components/LoginCidadao";
import LoginAtendente from "@/components/LoginAtendente";
import RegisterCidadao from "@/components/RegisterCidadao";
import RegisterAtendente from "@/components/RegisterAtendente";

type View = "select" | "login-cidadao" | "login-atendente" | "register-cidadao" | "register-atendente";

interface HomeProps {
  onLoginCidadao: (email: string, password: string) => void;
  onLoginAtendente: (instituicao: string, matricula: string, password: string) => void;
  onRegisterCidadao: (data: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
    password: string;
  }) => void;
  onRegisterAtendente: (data: {
    nome: string;
    instituicao: string;
    matricula: string;
    telefone: string;
    email: string;
    password: string;
  }) => void;
}

export default function Home({
  onLoginCidadao,
  onLoginAtendente,
  onRegisterCidadao,
  onRegisterAtendente,
}: HomeProps) {
  const [view, setView] = useState<View>("select");

  const handleSelectRole = (role: "cidadao" | "atendente") => {
    setView(role === "cidadao" ? "login-cidadao" : "login-atendente");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {view === "select" && (
        <div className="flex flex-col items-center gap-12 w-full">
          <Logo size="lg" showTagline={true} />
          <RoleSelector onSelectRole={handleSelectRole} />
        </div>
      )}

      {view === "login-cidadao" && (
        <LoginCidadao
          onBack={() => setView("select")}
          onLogin={onLoginCidadao}
          onRegister={() => setView("register-cidadao")}
        />
      )}

      {view === "login-atendente" && (
        <LoginAtendente
          onBack={() => setView("select")}
          onLogin={onLoginAtendente}
          onRegister={() => setView("register-atendente")}
        />
      )}

      {view === "register-cidadao" && (
        <RegisterCidadao
          onBack={() => setView("login-cidadao")}
          onRegister={onRegisterCidadao}
        />
      )}

      {view === "register-atendente" && (
        <RegisterAtendente
          onBack={() => setView("login-atendente")}
          onRegister={onRegisterAtendente}
        />
      )}
    </div>
  );
}
