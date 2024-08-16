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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  folderName: z
    .string()
    .min(1, { message: "Folder name must be at least 1 character." })
    .max(32, { message: "Folder name must be less than 32 characters." }),
});

import EmptyState from "@/components/empty-state";
import { PlusIcon } from "@radix-ui/react-icons";

async function createFolder(name: string) {
  try {
    const response = await fetch("http://localhost:3000/api/createFolder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error("Failed to create folder");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating folder:", error);
  }
}

interface FolderFormProps {
  onFolderCreated: () => void;
}

export function FolderForm({ onFolderCreated }: FolderFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folderName: "",
    },
  });

  const [isCreateFolderOpen, setCreateFolderOpen] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createFolder(values.folderName);
    setCreateFolderOpen(false);
    onFolderCreated(); // Refresh the folder list
  };

  // <Button variant="outline">Create folder</Button>

  return (
    <>
      <Dialog open={isCreateFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogTrigger asChild>
          <EmptyState>Create new folder</EmptyState>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create folder</DialogTitle>
            <DialogDescription>Name your folder</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="folderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folder name</FormLabel>
                    <FormControl>
                      <Input placeholder="this-is-folder-name" {...field} />
                    </FormControl>
                    <FormDescription>This is your folder name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create folder</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
