import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Logo from "./Logo";

interface LoginCidadaoProps {
  onBack: () => void;
  onLogin: (email: string, password: string) => void;
  onRegister: () => void;
}

export default function LoginCidadao({ onBack, onLogin, onRegister }: LoginCidadaoProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
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
          <h2 className="text-xl font-semibold mt-4">Acesso Cidadão</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
