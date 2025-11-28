import { Badge } from "@/components/ui/badge";
import { Clock, Send, UserCheck, CheckCircle } from "lucide-react";

export type OccurrenceStatus = "aguardando" | "despachado" | "atendimento" | "concluido";

interface StatusBadgeProps {
  status: OccurrenceStatus;
  size?: "sm" | "md";
}

const statusConfig = {
  aguardando: {
    label: "Aguardando",
    icon: Clock,
    className: "bg-emergency-aguardando/10 text-emergency-aguardando border-emergency-aguardando/30",
  },
  despachado: {
    label: "Despachado",
    icon: Send,
    className: "bg-emergency-despachado/10 text-emergency-despachado border-emergency-despachado/30",
  },
  atendimento: {
    label: "Em Atendimento",
    icon: UserCheck,
    className: "bg-emergency-atendimento/10 text-emergency-atendimento border-emergency-atendimento/30",
  },
  concluido: {
    label: "Concluído",
    icon: CheckCircle,
    className: "bg-emergency-concluido/10 text-emergency-concluido border-emergency-concluido/30",
  },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${size === "sm" ? "text-xs" : "text-sm"} gap-1`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      {config.label}
    </Badge>
  );
}
