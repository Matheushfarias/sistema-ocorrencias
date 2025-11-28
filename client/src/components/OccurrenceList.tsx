import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import OccurrenceCard, { Occurrence } from "./OccurrenceCard";
import { OccurrenceStatus } from "./StatusBadge";
import Logo from "./Logo";

interface OccurrenceListProps {
  occurrences: Occurrence[];
  onBack: () => void;
  onSelectOccurrence: (occurrence: Occurrence) => void;
  title?: string;
  showFilters?: boolean;
  isLoading?: boolean;
}

const filters: { label: string; value: OccurrenceStatus | "todas" }[] = [
  { label: "Todas", value: "todas" },
  { label: "Aguardando", value: "aguardando" },
  { label: "Despachado", value: "despachado" },
  { label: "Em Atendimento", value: "atendimento" },
  { label: "Concluído", value: "concluido" },
];

export default function OccurrenceList({
  occurrences,
  onBack,
  onSelectOccurrence,
  title = "Ocorrências",
  showFilters = true,
  isLoading = false,
}: OccurrenceListProps) {
  const [activeFilter, setActiveFilter] = useState<OccurrenceStatus | "todas">("todas");

  const filteredOccurrences = activeFilter === "todas"
    ? occurrences
    : occurrences.filter((o) => o.status === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
          <Logo size="sm" showTagline={false} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>

        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.value)}
                data-testid={`filter-${filter.value}`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando ocorrências...</p>
          </div>
        ) : filteredOccurrences.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhuma ocorrência encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOccurrences.map((occurrence) => (
              <OccurrenceCard
                key={occurrence.id}
                occurrence={occurrence}
                onClick={() => onSelectOccurrence(occurrence)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
