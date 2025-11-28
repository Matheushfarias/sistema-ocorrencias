import StatusBadge from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-4 p-8">
      <StatusBadge status="aguardando" />
      <StatusBadge status="despachado" />
      <StatusBadge status="atendimento" />
      <StatusBadge status="concluido" />
      <StatusBadge status="aguardando" size="sm" />
    </div>
  );
}
