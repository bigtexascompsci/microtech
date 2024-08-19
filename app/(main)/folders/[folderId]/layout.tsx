"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { UploadForm } from "./Upload";

import Link from "next/link";
import { NewChatForm } from "./NewChat";

async function fetchDocuments(folderId: number) {
  const response = await fetch("http://localhost:3000/api/getDocuments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folderId: folderId }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  const { result } = await response.json();
  return result;
}

async function fetchChats(folderId: number) {
  const response = await fetch("http://localhost:3000/api/getChats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folderId: folderId }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chats");
  }

  const { result } = await response.json();
  return result;
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    folderId: number;
  };
}) {
  const [documentsList, setDocumentsList] = useState<
    Array<{
      id: number;
      folder_id: number;
      name: string;
      type: string;
      created_at: Date;
      key: string;
      url: string;
    }>
  >([]);

  const [chatsList, setChatsList] = useState<
    Array<{
      id: number;
      folder_id: number;
      name: string;
      created_at: Date;
      updated_at: Date;
    }>
  >([]);

  useEffect(() => {
    console.log("IN USE EFFECT");

    const loadDocuments = async () => {
      try {
        const documents = await fetchDocuments(params.folderId);
        console.log("Fetched documents:", documents);

        // Ensure the data is an array
        if (Array.isArray(documents)) {
          setDocumentsList(documents);
        } else {
          console.error("Fetched data is not an array:", documents);
        }
      } catch (error) {
        console.error("Failed to fetch documents", error);
      }
    };
    loadDocuments();

    const loadChats = async () => {
      try {
        const chats = await fetchChats(params.folderId);
        console.log("Fetched chats:", chats);

        // Ensure the data is an array
        if (Array.isArray(chats)) {
          setChatsList(chats);
        } else {
          console.error("Fetched data is not an array:", chats);
        }
      } catch (error) {
        console.error("Failed to fetch chats", error);
      }
    };
    loadChats();
  }, [params.folderId]);

  const refreshDocuments = async () => {
    try {
      const documents = await fetchDocuments(params.folderId);
      if (Array.isArray(documents)) {
        setDocumentsList(documents);
      } else {
        console.error("Fetched data is not an array:", documents);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
    }
  };

  const refreshChats = async () => {
    try {
      const chats = await fetchChats(params.folderId);
      if (Array.isArray(chats)) {
        setChatsList(chats);
      } else {
        console.error("Fetched data is not an array:", chats);
      }
    } catch (error) {
      console.error("Failed to fetch chats", error);
    }
  };

  return (
    <>
      <div className="relative w-screen h-screen">
        <div className="relative isolate flex min-h-svh inset-y-0 left-0 w-screen">
          <div className="flex grow w-[600px] flex-col overflow-y-auto text-card-foreground px-8 py-6 border">
            <div className="text-lg font-semibold flex items-center justify-between mb-2">
              Documents
              <UploadForm
                folderId={params.folderId}
                onUploadCreated={refreshDocuments}
              />
            </div>
            <div className="flex flex-col mb-8">
              {documentsList.map((document) => (
                <Link
                  href={`/folders/${params.folderId}/documents/${document.id}`}
                  key={document.id}
                >
                  <Button
                    variant="link"
                    className="w-full justify-start text-left text-sm mb-[-8px] pl-0"
                  >
                    {document.name}
                  </Button>
                </Link>
              ))}
            </div>

            <div className="text-lg font-semibold flex items-center justify-between mb-2">
              Chats
              <NewChatForm
                folderId={params.folderId}
                onNewChatCreated={refreshChats}
              />
            </div>
            <div className="flex flex-col">
              {chatsList.map((chat) => (
                <Link
                  href={`/folders/${params.folderId}/chats/${chat.id}`}
                  key={chat.id}
                >
                  <Button
                    variant="link"
                    className="w-full justify-start text-left text-sm mb-[-8px] pl-0"
                  >
                    {chat.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full">{children}</div>
        </div>
      </div>
    </>
  );
}
