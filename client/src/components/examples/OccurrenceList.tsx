import OccurrenceList from "../OccurrenceList";
import { Occurrence } from "../OccurrenceCard";

// todo: remove mock functionality
const mockOccurrences: Occurrence[] = [
  {
    id: "1",
    codigo: "BO-2024-001234",
    tipo: "roubo",
    tipoEmergencia: "pm",
    status: "aguardando",
    cidadaoNome: "João Silva",
    cidadaoTelefone: "(11) 99999-8888",
    endereco: "Av. Paulista, 1000 - São Paulo, SP",
    descricao: "Roubo de celular próximo ao metrô",
    dataHora: new Date(Date.now() - 15 * 60000),
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    id: "2",
    codigo: "BO-2024-001235",
    tipo: "incêndio",
    tipoEmergencia: "bombeiros",
    status: "atendimento",
    cidadaoNome: "Maria Santos",
    cidadaoTelefone: "(11) 88888-7777",
    endereco: "Rua Augusta, 500 - São Paulo, SP",
    descricao: "Incêndio em apartamento",
    dataHora: new Date(Date.now() - 45 * 60000),
    latitude: -23.5555,
    longitude: -46.6433,
  },
  {
    id: "3",
    codigo: "BO-2024-001236",
    tipo: "acidente",
    tipoEmergencia: "pm",
    status: "despachado",
    cidadaoNome: "Pedro Costa",
    cidadaoTelefone: "(11) 77777-6666",
    endereco: "Marginal Pinheiros, km 15",
    descricao: "Acidente de trânsito com vítimas",
    dataHora: new Date(Date.now() - 30 * 60000),
    latitude: -23.5605,
    longitude: -46.6533,
  },
];

export default function OccurrenceListExample() {
  return (
    <OccurrenceList
      occurrences={mockOccurrences}
      onBack={() => console.log("Back")}
      onSelectOccurrence={(o) => console.log("Selected:", o)}
    />
  );
}
