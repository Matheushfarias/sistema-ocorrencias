import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Eye, EyeOff, Shield, Flame } from "lucide-react";
import Logo from "./Logo";

interface LoginAtendenteProps {
  onBack: () => void;
  onLogin: (instituicao: string, matricula: string, password: string) => void;
  onRegister: () => void;
}

export default function LoginAtendente({ onBack, onLogin, onRegister }: LoginAtendenteProps) {
  const [instituicao, setInstituicao] = useState("");
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(instituicao, matricula, password);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-6"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <Card className="p-8">
        <div className="flex flex-col items-center mb-8">
          <Logo size="md" showTagline={false} />
          <h2 className="text-xl font-semibold mt-4">Acesso Atendente</h2>
          <div className="flex items-center gap-2 mt-2">
            <Shield className="w-4 h-4 text-pm" />
            <span className="text-sm text-muted-foreground">/</span>
            <Flame className="w-4 h-4 text-bombeiros" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instituicao">Instituição</Label>
            <Select value={instituicao} onValueChange={setInstituicao}>
              <SelectTrigger data-testid="select-instituicao">
                <SelectValue placeholder="Selecione a instituição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-pm" />
                    Polícia Militar
                  </div>
                </SelectItem>
                <SelectItem value="bombeiros">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-bombeiros" />
                    Corpo de Bombeiros
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula / Identificação</Label>
            <Input
              id="matricula"
              placeholder="Digite sua matrícula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              data-testid="input-matricula"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="button-toggle-password"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" data-testid="button-login">
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Não tem conta?{" "}
            <button
              onClick={onRegister}
              className="text-primary hover:underline font-medium"
              data-testid="link-register"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
