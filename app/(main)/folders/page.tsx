"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Folder } from "./Folder";
import { FolderForm } from "./Form";
import { ModeToggle } from "@/components/mode-toggle";

async function fetchFolders() {
  const response = await fetch("http://localhost:3000/api/getFolders", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch folders");
  }

  const { result } = await response.json();
  return result;
}

export default function Page() {
  const [folderList, setFolderList] = useState<
    Array<{
      id: number;
      name: string;
      created_at: Date;
      updated_at: Date;
      documents_count: number;
      chats_count: number;
    }>
  >([]);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const folders = await fetchFolders();
        console.log("Fetched folders:", folders);

        // Ensure the data is an array
        if (Array.isArray(folders)) {
          setFolderList(folders);
        } else {
          console.error("Fetched data is not an array:", folders);
        }
      } catch (error) {
        console.error("Failed to fetch folders", error);
      }
    };
    loadFolders();
  }, []);

  const refreshFolders = async () => {
    try {
      const folders = await fetchFolders();
      if (Array.isArray(folders)) {
        setFolderList(folders);
      } else {
        console.error("Fetched data is not an array:", folders);
      }
    } catch (error) {
      console.error("Failed to fetch folders", error);
    }
  };

  return (
    <Container className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {folderList.map((folder) => (
          <Folder
            key={folder.id}
            folder={folder}
            onFolderDeleted={refreshFolders}
            onFolderRenamed={refreshFolders}
          />
        ))}
        <FolderForm onFolderCreated={refreshFolders} />
      </div>
      <ModeToggle />
    </Container>
  );
}
