import OccurrenceDetail from "../OccurrenceDetail";
import { Occurrence } from "../OccurrenceCard";

// todo: remove mock functionality
const mockOccurrence: Occurrence = {
  id: "1",
  codigo: "BO-2024-001234",
  tipo: "roubo",
  tipoEmergencia: "pm",
  status: "aguardando",
  cidadaoNome: "João Silva",
  cidadaoTelefone: "(11) 99999-8888",
  endereco: "Av. Paulista, 1000 - São Paulo, SP",
  descricao: "Roubo de celular próximo ao metrô. Suspeito fugiu em direção à estação Trianon-Masp. Vítima conseguiu ver que o suspeito usava jaqueta preta.",
  dataHora: new Date(Date.now() - 15 * 60000),
  latitude: -23.5505,
  longitude: -46.6333,
};

export default function OccurrenceDetailExample() {
  return (
    <OccurrenceDetail
      occurrence={mockOccurrence}
      onBack={() => console.log("Back")}
      onUpdateStatus={(status, obs) => console.log("Update:", status, obs)}
      onOpenChat={() => console.log("Open chat")}
      onCall={() => console.log("Call")}
      isAtendente={true}
      evidencias={["img1.jpg", "img2.jpg"]}
    />
  );
}
