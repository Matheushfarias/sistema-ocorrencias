import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, MapPin, Upload, Shield, Flame, X, Loader2 } from "lucide-react";
import Logo from "./Logo";

interface OccurrenceFormProps {
  onBack: () => void;
  onSubmit: (data: {
    tipoEmergencia: string;
    tipoOcorrencia: string;
    latitude: number;
    longitude: number;
    endereco: string;
    descricao: string;
    arquivos: File[];
  }) => void;
  isSubmitting?: boolean;
}

const tiposOcorrenciaPM = [
  "Roubo",
  "Furto",
  "Briga",
  "Perturbação",
  "Ameaça",
  "Violência Doméstica",
  "Vandalismo",
  "Tráfico de Drogas",
  "Porte Ilegal de Arma",
];

const tiposOcorrenciaBombeiros = [
  "Incêndio",
  "Desastre Natural",
  "Resgate",
  "Afogamento",
  "Atendimento Médico",
  "Acidente de Trânsito",
  "Vazamento de Gás",
  "Desabamento",
  "Salvamento em Altura",
];

export default function OccurrenceForm({ onBack, onSubmit, isSubmitting = false }: OccurrenceFormProps) {
  const [tipoEmergencia, setTipoEmergencia] = useState("");
  const [tipoOcorrencia, setTipoOcorrencia] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [endereco, setEndereco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleCapturarLocalizacao = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setEndereco(`Lat: ${position.coords.latitude.toFixed(6)}, Long: ${position.coords.longitude.toFixed(6)}`);
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoadingLocation(false);
        }
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArquivos([...arquivos, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setArquivos(arquivos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!latitude || !longitude) return;
    onSubmit({
      tipoEmergencia,
      tipoOcorrencia,
      latitude,
      longitude,
      endereco,
      descricao,
      arquivos,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <Logo size="sm" showTagline={false} />
          <h1 className="text-2xl font-bold mt-4">Registrar Ocorrência</h1>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Tipo de Emergência</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={tipoEmergencia === "pm" ? "default" : "outline"}
                  className={`h-auto py-4 ${tipoEmergencia === "pm" ? "bg-pm hover:bg-pm/90" : ""}`}
                  onClick={() => {
                    setTipoEmergencia("pm");
                    setTipoOcorrencia("");
                  }}
                  data-testid="button-tipo-pm"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Polícia Militar
                </Button>
                <Button
                  type="button"
                  variant={tipoEmergencia === "bombeiros" ? "default" : "outline"}
                  className={`h-auto py-4 ${tipoEmergencia === "bombeiros" ? "bg-bombeiros hover:bg-bombeiros/90" : ""}`}
                  onClick={() => {
                    setTipoEmergencia("bombeiros");
                    setTipoOcorrencia("");
                  }}
                  data-testid="button-tipo-bombeiros"
                >
                  <Flame className="w-5 h-5 mr-2" />
                  Corpo de Bombeiros
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoOcorrencia">Tipo de Ocorrência</Label>
              <Select 
                value={tipoOcorrencia} 
                onValueChange={setTipoOcorrencia}
                disabled={!tipoEmergencia}
              >
                <SelectTrigger data-testid="select-tipo-ocorrencia">
                  <SelectValue placeholder={tipoEmergencia ? "Selecione o tipo" : "Selecione primeiro o tipo de emergência"} />
                </SelectTrigger>
                <SelectContent>
                  {(tipoEmergencia === "pm" ? tiposOcorrenciaPM : tiposOcorrenciaBombeiros).map((tipo) => (
                    <SelectItem key={tipo} value={tipo.toLowerCase()}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Localização</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Capturar localização atual"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  readOnly
                  data-testid="input-endereco"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCapturarLocalizacao}
                  disabled={loadingLocation}
                  data-testid="button-capturar-localizacao"
                >
                  {loadingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {latitude && longitude && (
                <p className="text-xs text-muted-foreground">
                  Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva a situação em detalhes..."
                rows={5}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                data-testid="textarea-descricao"
              />
            </div>

            <div className="space-y-2">
              <Label>Fotos e Vídeos (opcional)</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arraste arquivos ou clique para enviar
                </p>
                <Input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileChange}
                  data-testid="input-files"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Selecionar Arquivos
                </Button>
              </div>
              {arquivos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {arquivos.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                    >
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg bg-destructive hover:bg-destructive/90"
              disabled={!tipoEmergencia || !tipoOcorrencia || !latitude || !longitude || !descricao || isSubmitting}
              data-testid="button-submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Ocorrência"
              )}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
