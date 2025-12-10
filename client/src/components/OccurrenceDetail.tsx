import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Map,
  Clock,
  Calendar,
  Image as ImageIcon,
  Shield,
  Flame,
} from "lucide-react";
import StatusBadge, { OccurrenceStatus } from "./StatusBadge";
import { Occurrence } from "./OccurrenceCard";
import Logo from "./Logo";

interface OccurrenceDetailProps {
  occurrence: Occurrence;
  onBack: () => void;
  onUpdateStatus: (newStatus: OccurrenceStatus, observacao: string) => void;
  onOpenChat: () => void;
  onCall: () => void;
  isAtendente?: boolean;
  evidencias?: string[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OccurrenceDetail({
  occurrence,
  onBack,
  onUpdateStatus,
  onOpenChat,
  onCall,
  isAtendente = true,
  evidencias = [],
}: OccurrenceDetailProps) {
  const [newStatus, setNewStatus] = useState<OccurrenceStatus>(occurrence.status);
  const [observacao, setObservacao] = useState("");

  const InstIcon = occurrence.tipoEmergencia === "pm" ? Shield : Flame;
  const instColor = occurrence.tipoEmergencia === "pm" ? "text-pm" : "text-bombeiros";

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${occurrence.latitude},${occurrence.longitude}`,
      "_blank"
    );
  };

  const openWaze = () => {
    window.open(
      `https://waze.com/ul?ll=${occurrence.latitude},${occurrence.longitude}&navigate=yes`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Logo size="sm" showTagline={false} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <InstIcon className={`w-6 h-6 ${instColor}`} />
            <h1 className="text-2xl font-bold font-mono">{occurrence.codigo}</h1>
          </div>
          <StatusBadge status={occurrence.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Rotas</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={openGoogleMaps}
                  className="flex-1"
                  data-testid="button-google-maps"
                >
                  <Map className="w-4 h-4 mr-2" />
                  Google Maps
                </Button>
                <Button
                  variant="outline"
                  onClick={openWaze}
                  className="flex-1"
                  data-testid="button-waze"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Waze
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold mb-4">Dados da Ocorrência</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium capitalize">{occurrence.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p>{occurrence.descricao}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <p>{occurrence.endereco}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p>{formatDate(occurrence.dataHora)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p>{formatTime(occurrence.dataHora)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Coordenadas</p>
                  <p className="font-mono text-sm">
                    {occurrence.latitude.toFixed(6)}, {occurrence.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </Card>

            {evidencias.length > 0 && (
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Evidências</h2>
                <div className="grid grid-cols-3 gap-2">
                  {evidencias.map((url, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-muted rounded-md overflow-hidden"
                    >
                      {url.includes('.mp4') || url.includes('.webm') ? (
                        <video src={url} className="w-full h-full object-cover" data-testid={`video-evidencia-${index}`} />
                      ) : (
                        <img src={url} alt={`Evidência ${index + 1}`} className="w-full h-full object-cover" data-testid={`image-evidencia-${index}`} />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Dados do Cidadão</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{occurrence.cidadaoNome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{occurrence.cidadaoTelefone}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" onClick={onCall} data-testid="button-call">
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar
                  </Button>
                  <Button variant="outline" onClick={onOpenChat} data-testid="button-chat">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </div>
            </Card>

            {isAtendente && (
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Atualizar Status</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Novo Status</Label>
                    <Select
                      value={newStatus}
                      onValueChange={(v) => setNewStatus(v as OccurrenceStatus)}
                    >
                      <SelectTrigger data-testid="select-new-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aguardando">Aguardando</SelectItem>
                        <SelectItem value="despachado">Despachado</SelectItem>
                        <SelectItem value="atendimento">Em Atendimento</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea
                      placeholder="Adicione observações sobre a atualização..."
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      rows={3}
                      data-testid="textarea-observacao"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => onUpdateStatus(newStatus, observacao)}
                    data-testid="button-save-status"
                  >
                    Salvar Atualização
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
