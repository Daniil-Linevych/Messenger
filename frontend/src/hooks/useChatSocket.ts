import { useEffect, useRef } from "react";
import type { Message } from "../types/message";

export function useChatSocket(
  conversationId: number,
  onNewMessage: (message: Message) => void,
  onUpdateMessage: (message: Message) => void,
  onDeleteMessage: (id: number) => void
) {
  const socketRef = useRef<WebSocket | null>(null);
  const API_URL =
    import.meta.env.BACKEND_WS_API_URL || "ws://localhost:8000/api/v1";

  useEffect(() => {
    if (!conversationId) return;

    const token = localStorage.getItem("access_token");
    const ws = new WebSocket(`${API_URL}/messages/?token=${token}`);

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.event) {
        case "new_message":
          onNewMessage(msg.data);
          break;
        case "update_message":
          onUpdateMessage(msg.data);
          break;
        case "delete_message":
          onDeleteMessage(msg.data.id);
          break;
      }
    };

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [conversationId]);

  const sendMessage = (content: string, receiverId: number, attachmentIds: number[] = []) => {
    socketRef.current?.send(
      JSON.stringify({
        action: "send",
        payload: { content, receiver_id: receiverId, attachment_ids: attachmentIds },
      })
    );
  };

  const updateExistingMessage = (message_id: number, content: string, attachment_ids: number[] = []) => {
    socketRef.current?.send(
      JSON.stringify({
        action: "update",
        message_id: message_id, 
        payload: { content, attachment_ids },
      })
    );
  };

  const deleteExistingMessage = (message_id: number) => {
    socketRef.current?.send(
      JSON.stringify({
        action: "delete",
        message_id: message_id
      })
    );
  };

  return { sendMessage, updateExistingMessage, deleteExistingMessage };
}
