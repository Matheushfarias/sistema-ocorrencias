import OccurrenceCard, { Occurrence } from "../OccurrenceCard";

const mockOccurrence: Occurrence = {
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
};

export default function OccurrenceCardExample() {
  return (
    <div className="p-8 max-w-md">
      <OccurrenceCard
        occurrence={mockOccurrence}
        onClick={() => console.log("Clicked")}
      />
    </div>
  );
}
