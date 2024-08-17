"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { UploadDropzone } from "@/app/uploadthing";

import { PlusIcon } from "@radix-ui/react-icons";

async function createDocument({
  folderId,
  file,
}: {
  folderId: number;
  file: {
    name: string;
    type: string;
    key: string;
    url: string;
  };
}) {
  try {
    const response = await fetch("http://localhost:3000/api/createDocument", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderId, file }), // Use folder_id
    });

    if (!response.ok) {
      throw new Error("Failed to create folder");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating folder:", error);
  }
}

interface UploadFormProps {
  folderId: number;
  onUploadCreated: () => void;
}

export function UploadForm({ folderId, onUploadCreated }: UploadFormProps) {
  const [isUploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <Dialog open={isUploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-[424px]">
          <DialogHeader>
            <DialogTitle>Upload documents</DialogTitle>
            <DialogDescription>
              Choose or drag and drop your documents
            </DialogDescription>
          </DialogHeader>

          <UploadDropzone
            className="bg-card border-4 border-muted-foreground/25 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
            endpoint="pdfUploader"
            onClientUploadComplete={async (res) => {
              res.map(async (file) => {
                // Do something with the response
                console.log("Files: ", res);
                await createDocument({
                  folderId: folderId,
                  file: {
                    name: file.name,
                    type: file.type,
                    key: file.key,
                    url: file.url,
                  },
                });
              });
              setUploadOpen(false);
              onUploadCreated();
              console.log("DOCUMENT UPLOADED");
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        </DialogContent>
      </Dialog>
      <Button variant="ghost" size="icon" onClick={() => setUploadOpen(true)}>
        <PlusIcon className="h-4 w-4" />
      </Button>
    </>
  );
}
