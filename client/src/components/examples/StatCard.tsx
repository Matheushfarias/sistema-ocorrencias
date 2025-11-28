import StatCard from "../StatCard";
import { Clock, UserCheck, CheckCircle, Timer } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-8">
      <StatCard title="Aguardando" value={5} icon={Clock} iconColor="text-emergency-aguardando" />
      <StatCard title="Em Atendimento" value={3} icon={UserCheck} iconColor="text-emergency-atendimento" />
      <StatCard title="Resolvidos Hoje" value={12} icon={CheckCircle} iconColor="text-emergency-concluido" />
      <StatCard title="Tempo Médio" value="15 min" icon={Timer} iconColor="text-muted-foreground" />
    </div>
  );
}
