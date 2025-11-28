import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Eye, EyeOff, AlertTriangle, Shield, Flame } from "lucide-react";
import Logo from "./Logo";

interface RegisterAtendenteProps {
  onBack: () => void;
  onRegister: (data: {
    nome: string;
    instituicao: string;
    matricula: string;
    telefone: string;
    email: string;
    password: string;
  }) => void;
}

export default function RegisterAtendente({ onBack, onRegister }: RegisterAtendenteProps) {
  const [nome, setNome] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [matricula, setMatricula] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    onRegister({ nome, instituicao, matricula, telefone, email, password });
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
        <div className="flex flex-col items-center mb-6">
          <Logo size="sm" showTagline={false} />
          <h2 className="text-xl font-semibold mt-4">Cadastro Atendente</h2>
        </div>

        <Alert className="mb-6 border-destructive/20 bg-destructive/5">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <AlertDescription className="text-sm">
            Acesso restrito a servidores públicos autorizados das corporações.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              data-testid="input-nome"
            />
          </div>

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
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => setTelefone(formatPhone(e.target.value))}
              data-testid="input-telefone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
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
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              data-testid="input-confirm-password"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive">As senhas não coincidem</p>
            )}
          </div>

          <Button type="submit" className="w-full" data-testid="button-register">
            Cadastrar
          </Button>
        </form>
      </Card>
    </div>
  );
}
