import DashboardAtendente from "../DashboardAtendente";

export default function DashboardAtendenteExample() {
  return (
    <DashboardAtendente
      nome="Carlos Oliveira"
      matricula="PM-12345"
      instituicao="pm"
      stats={{
        aguardando: 5,
        emAtendimento: 3,
        resolvidosHoje: 12,
        tempoMedio: "15 min",
      }}
      pendingCount={5}
      onViewOccurrences={() => console.log("View occurrences")}
      onOpenChat={() => console.log("Open chat")}
      onLogout={() => console.log("Logout")}
    />
  );
}
