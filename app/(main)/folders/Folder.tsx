"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { formatTimestampToLocalTime } from "@/lib/utils";
import {
  IoDocumentsOutline,
  IoChatbubblesOutline,
  IoTrash,
  IoPencil,
} from "react-icons/io5";

async function deleteFolder(id: number) {
  const response = await fetch("http://localhost:3000/api/deleteFolder", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }), // Send the folder ID in the body
  });

  console.log(response.json());

  if (!response.ok) {
    throw new Error("Failed to delete folder");
  }

  return response.json();
}

async function renameFolder(id: number, name: string) {
  const response = await fetch("http://localhost:3000/api/renameFolder", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, name }), // Send the folder ID in the body
  });

  if (!response.ok) {
    throw new Error("Failed to delete folder");
  }

  return response.json();
}

interface FolderProps {
  folder: {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    documents_count: number;
    chats_count: number;
  };
  onFolderDeleted: () => void; // Prop to refresh folder list
  onFolderRenamed: () => void;
}

export const Folder = ({
  folder,
  onFolderDeleted,
  onFolderRenamed,
}: FolderProps) => {
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isRenameOpen, setRenameOpen] = useState(false);

  const handleDelete = async () => {
    setDeleteOpen(false);
    try {
      await deleteFolder(folder.id);
      console.log("Folder deleted");
      onFolderDeleted(); // Refresh the folder list
    } catch (error) {
      console.error("Failed to delete folder", error);
    }
  };

  const handleRename = async (name: string) => {
    setRenameOpen(false);
    try {
      await renameFolder(folder.id, name);
      console.log("Folder renamed");
      onFolderDeleted(); // Refresh the folder list
    } catch (error) {
      console.error("Failed to rename folder", error);
    }
  };

  const formSchema = z.object({
    folderNewName: z
      .string()
      .min(1, { message: "Folder name must be at least 1 character." })
      .max(32, { message: "Folder name must be less than 32 characters." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folderNewName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    handleRename(values.folderNewName);
    setRenameOpen(false);
    onFolderRenamed(); // Refresh the folder list
  };

  return (
    <>
      <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              project, the documents in this project, and the chats in this
              project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isRenameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename folder</DialogTitle>
            <DialogDescription>Rename your folder</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="folderNewName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folder name</FormLabel>
                    <FormControl>
                      <Input placeholder="this-fodler-new-name" {...field} />
                    </FormControl>
                    <FormDescription>This is your folder name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Rename folder</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card key={folder.id}>
        <CardHeader>
          <CardTitle>{folder.name}</CardTitle>
          <CardDescription>{`Last edited on ${formatTimestampToLocalTime(
            folder.updated_at
          )}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex-grow">
            <div className="mb-1 flex gap-2 last:mb-0">
              <div className="flex aspect-square items-center justify-center rounded-full bg-primary-100">
                <IoDocumentsOutline className="mr-2 h-4 w-4" />
              </div>
              {folder.documents_count === 1
                ? "1 document"
                : `${folder.documents_count} documents`}
            </div>
            <div className="mb-1 flex gap-2 last:mb-0">
              <div className="flex aspect-square items-center justify-center rounded-full bg-primary-100">
                <IoChatbubblesOutline className="mr-2 h-4 w-4" />
              </div>
              {folder.chats_count === 1
                ? "1 chat"
                : `${folder.chats_count} chats`}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="flex items-center"
                onClick={() => setDeleteOpen(true)}
              >
                <IoTrash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center"
                onClick={() => setRenameOpen(true)}
              >
                <IoPencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href={`/folders/${folder.id}`}>
            <Button>Open folder</Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};
