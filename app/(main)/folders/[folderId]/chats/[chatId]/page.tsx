"use client";
import { SendForm } from "./Send";

import { useState, useEffect } from "react";

async function fetchMessages(chatId: number) {
  const response = await fetch("http://localhost:3000/api/getMessages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatId: chatId }),
  });

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const { result } = await response.json();
  return result;
}

export default function ChatPage({ params }: { params: { chatId: number } }) {
  const [messagesList, setMessagesList] = useState<
    Array<{
      id: number;
      chat_id: string;
      created_at: Date;
      role: "USER" | "ASSISTANT";
      content: string;
      embedding_ids: any;
    }>
  >([]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await fetchMessages(params.chatId);
        console.log("Fetched messages:", messages);

        // Ensure the data is an array
        if (Array.isArray(messages)) {
          setMessagesList(messages);
        } else {
          console.error("Fetched data is not an array:", messages);
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    loadMessages();
  }, [params.chatId]);

  const refreshMessages = async () => {
    try {
      const messages = await fetchMessages(params.chatId);
      if (Array.isArray(messages)) {
        setMessagesList(messages);
      } else {
        console.error("Fetched data is not an array:", messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  return (
    <>
      <div className="h-screen w-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-8">
          {messagesList.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "USER" ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`inline-block w-auto max-w-2xl ${
                  message.role === "USER"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                } rounded-lg p-4 text-md font-medium mb-4`}
              >
                {message.content}
              </span>
            </div>
          ))}
        </div>
        <div className="p-4">
          <SendForm onMessageSent={refreshMessages} chatId={params.chatId} />
        </div>
      </div>
    </>
  );
}
