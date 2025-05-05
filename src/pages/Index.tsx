import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatHeader from "../components/ChatHeader";
import ChatContainer from "../components/ChatContainer";
import { Attachment, ChatSettings } from "../types";
import { importChatHistory } from "../utils";
import { downloadAttachment } from "../utils/attachmentHandlers";
import { toast } from "@/hooks/use-toast";
import { useCopyMessage } from "@/hooks/useCopyMessage";

type User = {
  name: string;
  webhook: string;
};

const Index = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const { handleCopy } = useCopyMessage();

  const [settings, setSettings] = useState<ChatSettings>({
    webhookUrl: user.webhook,
    chatName: `Chat de ${user.name}`,
    typing: true,
    chatId: `${user.name}-chat-${Date.now()}`, // ID único por sesión
  });

  const [isConnected, setIsConnected] = useState(!!user.webhook);

  const handleLogout = () => {
    localStorage.removeItem("chat_user");
    navigate("/login", { replace: true });
  };

  const handleCopyMessage = (content: string) => {
    // Callback vacío, como en original
  };

  const handleDownloadAttachment = (attachment: Attachment) => {
    downloadAttachment(attachment);
  };

  const handleImportChat = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const importedChat = importChatHistory(e.target.result as string);
          if (importedChat) {
            const newSettings = {
              ...settings,
              chatId: importedChat.id,
              chatName: importedChat.name,
            };
            setSettings(newSettings);

            toast("Chat history imported successfully", {
              duration: 2000,
              className: "bg-black/70 text-white text-xs py-1.5 px-3 rounded-md border-0",
            });

            window.location.reload();
          }
        } catch (error) {
          console.error("Failed to import chat history:", error);
          toast("Failed to import chat history", {
            duration: 2000,
            className: "bg-black/70 text-red-300 text-xs py-1.5 px-3 rounded-md border-0",
          });
        }
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-screen bg-chat-dark text-white">
      <div className="flex justify-end p-2">
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white border border-gray-600 px-3 py-1 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      <ChatHeader
        settings={settings}
        isConnected={isConnected}
        onOpenSettings={() => {}}
      />

      <ChatContainer
        settings={settings}
        isConnected={isConnected}
        onCopyMessage={handleCopyMessage}
        onDownloadAttachment={handleDownloadAttachment}
      />
    </div>
  );
};

export default Index;
