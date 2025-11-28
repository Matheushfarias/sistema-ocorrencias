import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Plus, FileText, MessageCircle, LogOut, User } from "lucide-react";
import Logo from "./Logo";

interface DashboardCidadaoProps {
  userName: string;
  onNewOccurrence: () => void;
  onViewMyBOs: () => void;
  onOpenChat: () => void;
  onLogout: () => void;
}

export default function DashboardCidadao({
  userName,
  onNewOccurrence,
  onViewMyBOs,
  onOpenChat,
  onLogout,
}: DashboardCidadaoProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="sm" showTagline={false} />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="hidden sm:inline">{userName}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Painel do Cidadão</h1>

        <Alert className="mb-8 border-destructive bg-destructive/5">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <AlertDescription className="text-base font-medium text-destructive">
            Emergência? Use o botão abaixo para registrar uma nova ocorrência e acionar as autoridades.
          </AlertDescription>
        </Alert>

        <Button
          size="lg"
          className="w-full py-8 text-lg mb-8 bg-destructive hover:bg-destructive/90"
          onClick={onNewOccurrence}
          data-testid="button-new-occurrence"
        >
          <Plus className="w-6 h-6 mr-3" />
          Registrar Nova Ocorrência
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
            onClick={onViewMyBOs}
            data-testid="card-my-bos"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Meus B.O.s</h3>
                <p className="text-sm text-muted-foreground">
                  Acompanhe suas ocorrências
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
                <h3 className="font-semibold">Chat com a Central</h3>
                <p className="text-sm text-muted-foreground">
                  Converse com os atendentes
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
