import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  UserCheck,
  CheckCircle,
  Timer,
  AlertTriangle,
  FileText,
  MessageCircle,
  LogOut,
  Shield,
  Flame,
} from "lucide-react";
import Logo from "./Logo";
import StatCard from "./StatCard";

interface DashboardAtendenteProps {
  nome: string;
  matricula: string;
  instituicao: "pm" | "bombeiros";
  stats: {
    aguardando: number;
    emAtendimento: number;
    resolvidosHoje: number;
    tempoMedio: string;
  };
  pendingCount: number;
  onViewOccurrences: () => void;
  onOpenChat: () => void;
  onLogout: () => void;
}

export default function DashboardAtendente({
  nome,
  matricula,
  instituicao,
  stats,
  pendingCount,
  onViewOccurrences,
  onOpenChat,
  onLogout,
}: DashboardAtendenteProps) {
  const InstIcon = instituicao === "pm" ? Shield : Flame;
  const instColor = instituicao === "pm" ? "text-pm" : "text-bombeiros";
  const instLabel = instituicao === "pm" ? "Polícia Militar" : "Corpo de Bombeiros";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="sm" showTagline={false} />
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1">
              <InstIcon className={`w-3 h-3 ${instColor}`} />
              <span className="hidden sm:inline">{instLabel}</span>
            </Badge>
            <div className="text-sm text-right hidden md:block">
              <p className="font-medium">{nome}</p>
              <p className="text-xs text-muted-foreground">Mat: {matricula}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Painel do Atendente</h1>
            <div className="flex items-center gap-2 mt-1">
              <InstIcon className={`w-4 h-4 ${instColor}`} />
              <span className="text-muted-foreground">{instLabel}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Aguardando"
            value={stats.aguardando}
            icon={Clock}
            iconColor="text-emergency-aguardando"
          />
          <StatCard
            title="Em Atendimento"
            value={stats.emAtendimento}
            icon={UserCheck}
            iconColor="text-emergency-atendimento"
          />
          <StatCard
            title="Resolvidos Hoje"
            value={stats.resolvidosHoje}
            icon={CheckCircle}
            iconColor="text-emergency-concluido"
          />
          <StatCard
            title="Tempo Médio"
            value={stats.tempoMedio}
            icon={Timer}
            iconColor="text-muted-foreground"
          />
        </div>

        {pendingCount > 0 && (
          <Alert className="mb-8 border-destructive bg-destructive/5">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <AlertDescription className="flex items-center justify-between flex-1">
              <span className="text-base font-medium text-destructive">
                {pendingCount} ocorrência{pendingCount > 1 ? "s" : ""} pendente{pendingCount > 1 ? "s" : ""}
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={onViewOccurrences}
                data-testid="button-view-pending"
              >
                Ver ocorrências
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <h2 className="text-lg font-semibold mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
            onClick={onViewOccurrences}
            data-testid="card-all-occurrences"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Todas Ocorrências</h3>
                <p className="text-sm text-muted-foreground">
                  Gerencie e atualize status
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
            onClick={onOpenChat}
            data-testid="card-chat"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Chat com Cidadãos</h3>
                <p className="text-sm text-muted-foreground">
                  Responda mensagens
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <h3 className="font-semibold mb-4">Protocolo de Atendimento</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emergency-aguardando" />
              <span>Avaliar prioridade</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emergency-despachado" />
              <span>Atualizar status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emergency-atendimento" />
              <span>Comunicar cidadão</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emergency-concluido" />
              <span>Encerrar ocorrência</span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
