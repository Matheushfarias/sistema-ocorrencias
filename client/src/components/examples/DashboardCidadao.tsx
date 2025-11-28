import DashboardCidadao from "../DashboardCidadao";

export default function DashboardCidadaoExample() {
  return (
    <DashboardCidadao
      userName="João Silva"
      onNewOccurrence={() => console.log("New occurrence")}
      onViewMyBOs={() => console.log("View my BOs")}
      onOpenChat={() => console.log("Open chat")}
      onLogout={() => console.log("Logout")}
    />
  );
}
