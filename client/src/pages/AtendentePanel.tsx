import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardAtendente from "@/components/DashboardAtendente";
import OccurrenceList from "@/components/OccurrenceList";
import OccurrenceDetail from "@/components/OccurrenceDetail";
import Chat from "@/components/Chat";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import {
  getOccurrences,
  getOccurrence,
  getStats,
  getMessages,
  sendMessage,
  updateOccurrenceStatus,
  type Occurrence,
  type Message,
} from "@/lib/api";

type View = "dashboard" | "list" | "detail" | "chat";

interface AtendentePanelProps {
  nome: string;
  matricula: string;
  instituicao: "pm" | "bombeiros";
  onLogout: () => void;
}

export default function AtendentePanel({ nome, matricula, instituicao, onLogout }: AtendentePanelProps) {
  const [view, setView] = useState<View>("dashboard");
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: occurrences = [], isLoading: loadingOccurrences, refetch: refetchOccurrences } = useQuery({
    queryKey: ["/api/occurrences"],
    queryFn: getOccurrences,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: getStats,
  });

  const { data: selectedOccurrence } = useQuery({
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

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, observacao }: { status: string; observacao: string }) =>
      updateOccurrenceStatus(selectedOccurrenceId!, status, observacao),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/occurrences"] });
      queryClient.invalidateQueries({ queryKey: ["/api/occurrences", selectedOccurrenceId] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Status atualizado",
        description: "Ocorrência atualizada com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o status",
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

  const handleUpdateStatus = (newStatus: string, observacao: string) => {
    updateStatusMutation.mutate({ status: newStatus, observacao });
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
    cidadaoNome: occ.cidadao?.nome || "Cidadão",
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
    cidadaoNome: selectedOccurrence.cidadao?.nome || "Cidadão",
    cidadaoTelefone: selectedOccurrence.cidadao?.telefone || "",
    cidadaoCpf: selectedOccurrence.cidadao?.cpf || "",
    endereco: selectedOccurrence.endereco,
    descricao: selectedOccurrence.descricao,
    dataHora: new Date(selectedOccurrence.createdAt),
    latitude: parseFloat(selectedOccurrence.latitude),
    longitude: parseFloat(selectedOccurrence.longitude),
  } : null;

  const dashboardStats = {
    aguardando: stats?.aguardando || 0,
    emAtendimento: stats?.atendimento || 0,
    resolvidosHoje: stats?.concluidos || 0,
    tempoMedio: "15 min",
  };

  return (
    <>
      {view === "dashboard" && (
        <DashboardAtendente
          nome={nome}
          matricula={matricula}
          instituicao={instituicao}
          stats={dashboardStats}
          pendingCount={dashboardStats.aguardando}
          onViewOccurrences={() => {
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
                description: "Não há ocorrências para abrir o chat",
              });
            }
          }}
          onLogout={onLogout}
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
          title="Todas Ocorrências"
          showFilters={true}
          isLoading={loadingOccurrences}
        />
      )}

      {view === "detail" && transformedSelectedOccurrence && (
        <OccurrenceDetail
          occurrence={transformedSelectedOccurrence}
          onBack={() => setView("list")}
          onUpdateStatus={handleUpdateStatus}
          onOpenChat={() => setView("chat")}
          onCall={() => {
            if (transformedSelectedOccurrence.cidadaoTelefone) {
              window.open(`tel:${transformedSelectedOccurrence.cidadaoTelefone}`);
            }
          }}
          isAtendente={true}
        />
      )}

      {view === "chat" && selectedOccurrenceId && (
        <Chat
          occurrenceCode={transformedSelectedOccurrence?.codigo || ""}
          messages={transformedMessages}
          onBack={() => setView(selectedOccurrenceId ? "detail" : "dashboard")}
          onSendMessage={handleSendMessage}
          isAtendente={true}
          isSending={sendMessageMutation.isPending}
        />
      )}
    </>
  );
}
