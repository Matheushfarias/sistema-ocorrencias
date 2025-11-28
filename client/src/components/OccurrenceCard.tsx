import { Card } from "@/components/ui/card";
import { Shield, Flame, MapPin, Phone, Clock } from "lucide-react";
import StatusBadge, { OccurrenceStatus } from "./StatusBadge";

export interface Occurrence {
  id: string;
  codigo: string;
  tipo: string;
  tipoEmergencia: "pm" | "bombeiros";
  status: OccurrenceStatus;
  cidadaoNome: string;
  cidadaoTelefone: string;
  endereco: string;
  descricao: string;
  dataHora: Date;
  latitude: number;
  longitude: number;
}

interface OccurrenceCardProps {
  occurrence: Occurrence;
  onClick: () => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}min`;
  }
  return `${minutes}min`;
}

export default function OccurrenceCard({ occurrence, onClick }: OccurrenceCardProps) {
  const InstIcon = occurrence.tipoEmergencia === "pm" ? Shield : Flame;
  const instColor = occurrence.tipoEmergencia === "pm" ? "text-pm" : "text-bombeiros";

  return (
    <Card
      className="p-4 cursor-pointer hover-elevate active-elevate-2 transition-all"
      onClick={onClick}
      data-testid={`card-occurrence-${occurrence.id}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <InstIcon className={`w-5 h-5 ${instColor}`} />
          <span className="font-mono text-sm font-medium">{occurrence.codigo}</span>
        </div>
        <StatusBadge status={occurrence.status} size="sm" />
      </div>

      <div className="space-y-2">
        <p className="font-semibold capitalize">{occurrence.tipo}</p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{occurrence.cidadaoNome}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{occurrence.endereco}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4 flex-shrink-0" />
          <span>{occurrence.cidadaoTelefone}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>Há {formatTimeAgo(occurrence.dataHora)}</span>
        </div>
      </div>
    </Card>
  );
}
