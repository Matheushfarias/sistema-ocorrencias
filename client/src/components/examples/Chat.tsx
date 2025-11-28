import { useState } from "react";
import Chat from "../Chat";

// todo: remove mock functionality
const initialMessages = [
  {
    id: "1",
    remetente: "sistema" as const,
    mensagem: "Olá, sou o assistente virtual do BO.Militar. Como posso ajudar?",
    dataHora: new Date(Date.now() - 10 * 60000),
  },
  {
    id: "2",
    remetente: "cidadao" as const,
    mensagem: "Boa tarde, gostaria de saber o status da minha ocorrência",
    dataHora: new Date(Date.now() - 8 * 60000),
  },
  {
    id: "3",
    remetente: "atendente" as const,
    mensagem: "Boa tarde! Sua ocorrência está sendo analisada e uma viatura será despachada em breve.",
    dataHora: new Date(Date.now() - 5 * 60000),
  },
];

export default function ChatExample() {
  const [messages, setMessages] = useState(initialMessages);

  const handleSendMessage = (mensagem: string) => {
    const newMsg = {
      id: String(messages.length + 1),
      remetente: "cidadao" as const,
      mensagem,
      dataHora: new Date(),
    };
    setMessages([...messages, newMsg]);
  };

  return (
    <Chat
      occurrenceCode="BO-2024-001234"
      messages={messages}
      onBack={() => console.log("Back")}
      onSendMessage={handleSendMessage}
      isAtendente={false}
    />
  );
}
