import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardCidadao from "@/components/DashboardCidadao";
import OccurrenceForm from "@/components/OccurrenceForm";
import OccurrenceList from "@/components/OccurrenceList";
import OccurrenceDetail from "@/components/OccurrenceDetail";
import Chat from "@/components/Chat";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import {
  getOccurrences,
  getOccurrence,
  createOccurrence,
  uploadMedia,
  getMessages,
  sendMessage,
  type Occurrence,
  type Message,
} from "@/lib/api";

type View = "dashboard" | "form" | "list" | "detail" | "chat";

interface CidadaoPanelProps {
  userName: string;
  userId: string;
  onLogout: () => void;
}

export default function CidadaoPanel({ userName, userId, onLogout }: CidadaoPanelProps) {
  const [view, setView] = useState<View>("dashboard");
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: occurrences = [], isLoading: loadingOccurrences, refetch: refetchOccurrences } = useQuery({
    queryKey: ["/api/occurrences"],
    queryFn: getOccurrences,
  });

  const { data: selectedOccurrence, isLoading: loadingDetail } = useQuery({
    queryKey: ["/api/occurrences", selectedOccurrenceId],
    queryFn: () => selectedOccurrenceId ? getOccurrence(selectedOccurrenceId) : null,
    enabled: !!selectedOccurrenceId,
  });

  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ["/api/occurrences", selectedOccurrenceId, "messages"],
    queryFn: () => selectedOccurrenceId ? getMessages(selectedOccurrenceId) : [],
    enabled: !!selectedOccurrenceId,
    refetchInterval: view === "chat" ? 5000 : false,
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      tipoEmergencia: "pm" | "bombeiros";
      tipoOcorrencia: string;
      latitude: number;
      longitude: number;
      endereco: string;
      descricao: string;
      arquivos: File[];
    }) => {
      const occurrence = await createOccurrence({
        tipoEmergencia: data.tipoEmergencia,
        tipoOcorrencia: data.tipoOcorrencia,
        descricao: data.descricao,
        endereco: data.endereco,
        latitude: data.latitude,
        longitude: data.longitude,
      });

      if (data.arquivos.length > 0) {
        await uploadMedia(occurrence.id, data.arquivos);
      }

      return occurrence;
    },
    onSuccess: (occurrence) => {
      queryClient.invalidateQueries({ queryKey: ["/api/occurrences"] });
      toast({
        title: "Ocorrência registrada",
        description: `Código: ${occurrence.codigo}`,
      });
      setView("dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao registrar",
        description: error.message || "Não foi possível registrar a ocorrência",
        variant: "destructive",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => sendMessage(selectedOccurrenceId!, content),
    onSuccess: () => {
      refetchMessages();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao enviar",
        description: error.message || "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
    },
  });

  const handleNewOccurrence = (data: {
    tipoEmergencia: string;
    tipoOcorrencia: string;
    latitude: number;
    longitude: number;
    endereco: string;
    descricao: string;
    arquivos: File[];
  }) => {
    createMutation.mutate({
      tipoEmergencia: data.tipoEmergencia as "pm" | "bombeiros",
      tipoOcorrencia: data.tipoOcorrencia,
      latitude: data.latitude,
      longitude: data.longitude,
      endereco: data.endereco,
      descricao: data.descricao,
      arquivos: data.arquivos,
    });
  };

  const handleSendMessage = (mensagem: string) => {
    sendMessageMutation.mutate(mensagem);
  };

  const transformedOccurrences = occurrences.map((occ: Occurrence) => ({
    id: occ.id,
    codigo: occ.codigo,
    tipo: occ.tipoOcorrencia,
    tipoEmergencia: occ.tipoEmergencia,
    status: occ.status,
    cidadaoNome: occ.cidadao?.nome || userName,
    cidadaoTelefone: occ.cidadao?.telefone || "",
    endereco: occ.endereco,
    descricao: occ.descricao,
    dataHora: new Date(occ.createdAt),
    latitude: parseFloat(occ.latitude),
    longitude: parseFloat(occ.longitude),
  }));

  const transformedMessages = messages.map((msg: Message) => ({
    id: msg.id,
    remetente: msg.role as "sistema" | "cidadao" | "atendente",
    mensagem: msg.content,
    dataHora: new Date(msg.createdAt),
  }));

  const transformedSelectedOccurrence = selectedOccurrence ? {
    id: selectedOccurrence.id,
    codigo: selectedOccurrence.codigo,
    tipo: selectedOccurrence.tipoOcorrencia,
    tipoEmergencia: selectedOccurrence.tipoEmergencia,
    status: selectedOccurrence.status,
    cidadaoNome: selectedOccurrence.cidadao?.nome || userName,
    cidadaoTelefone: selectedOccurrence.cidadao?.telefone || "",
    cidadaoCpf: selectedOccurrence.cidadao?.cpf || "",
    endereco: selectedOccurrence.endereco,
    descricao: selectedOccurrence.descricao,
    dataHora: new Date(selectedOccurrence.createdAt),
    latitude: parseFloat(selectedOccurrence.latitude),
    longitude: parseFloat(selectedOccurrence.longitude),
  } : null;

  return (
    <>
      {view === "dashboard" && (
        <DashboardCidadao
          userName={userName}
          onNewOccurrence={() => setView("form")}
          onViewMyBOs={() => {
            refetchOccurrences();
            setView("list");
          }}
          onOpenChat={() => {
            if (occurrences.length > 0) {
              setSelectedOccurrenceId(occurrences[0].id);
              setView("chat");
            } else {
              toast({
                title: "Nenhuma ocorrência",
                description: "Você precisa registrar uma ocorrência primeiro para usar o chat",
              });
            }
          }}
          onLogout={onLogout}
        />
      )}

      {view === "form" && (
        <OccurrenceForm
          onBack={() => setView("dashboard")}
          onSubmit={handleNewOccurrence}
          isSubmitting={createMutation.isPending}
        />
      )}

      {view === "list" && (
        <OccurrenceList
          occurrences={transformedOccurrences}
          onBack={() => setView("dashboard")}
          onSelectOccurrence={(o) => {
            setSelectedOccurrenceId(o.id);
            setView("detail");
          }}
          title="Meus B.O.s"
          showFilters={true}
          isLoading={loadingOccurrences}
        />
      )}

      {view === "detail" && transformedSelectedOccurrence && (
        <OccurrenceDetail
          occurrence={transformedSelectedOccurrence}
          onBack={() => setView("list")}
          onUpdateStatus={() => {}}
          onOpenChat={() => setView("chat")}
          onCall={() => {
            if (transformedSelectedOccurrence.cidadaoTelefone) {
              window.open(`tel:${transformedSelectedOccurrence.cidadaoTelefone}`);
            }
          }}
          isAtendente={false}
        />
      )}

      {view === "chat" && selectedOccurrenceId && (
        <Chat
          occurrenceCode={transformedSelectedOccurrence?.codigo || ""}
          messages={transformedMessages}
          onBack={() => setView(selectedOccurrenceId ? "detail" : "dashboard")}
          onSendMessage={handleSendMessage}
          isAtendente={false}
          isSending={sendMessageMutation.isPending}
        />
      )}
    </>
  );
}
