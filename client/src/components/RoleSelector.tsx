import { Card } from "@/components/ui/card";
import { User, Shield, Flame } from "lucide-react";

interface RoleSelectorProps {
  onSelectRole: (role: "cidadao" | "atendente") => void;
}

export default function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
      <Card
        className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
        onClick={() => onSelectRole("cidadao")}
        data-testid="card-role-cidadao"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Cidadão</h3>
            <p className="text-sm text-muted-foreground">
              Registrar e acompanhar ocorrências
            </p>
          </div>
        </div>
      </Card>

      <Card
        className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
        onClick={() => onSelectRole("atendente")}
        data-testid="card-role-atendente"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <div className="flex gap-1">
              <Shield className="w-5 h-5 text-pm" />
              <Flame className="w-5 h-5 text-bombeiros" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Atendente</h3>
            <p className="text-sm text-muted-foreground">
              PM / Bombeiros - Receber e atender chamados
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
