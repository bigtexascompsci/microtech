"use client";

import { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Label } from "@/components/ui/label";
import { PlusIcon } from "@radix-ui/react-icons";

async function createChat({
  folderId,
  chatName,
}: {
  folderId: number;
  chatName: string;
}) {
  try {
    const response = await fetch("http://localhost:3000/api/createChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderId, chatName }),
    });

    if (!response.ok) {
      throw new Error("Failed to create chat");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating chat:", error);
  }
}

interface UploadFormProps {
  folderId: number;
  onNewChatCreated: () => void;
}

const formSchema = z.object({
  chatName: z
    .string()
    .min(1, { message: "Chat name must be at least 1 character." })
    .max(32, { message: "Chat name must be less than 32 characters." }),
});

export function NewChatForm({ folderId, onNewChatCreated }: UploadFormProps) {
  const [isNewChatOpen, setNewChatOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createChat({ folderId: folderId, chatName: values.chatName });
    setNewChatOpen(false);
    onNewChatCreated(); // Refresh the folder list
  };

  return (
    <>
      <Dialog open={isNewChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent className="sm:max-w-[424px]">
          <DialogHeader>
            <DialogTitle>Create chat</DialogTitle>
            <DialogDescription>
              Enter the chat name to create your chat.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="chatName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chat name</FormLabel>
                    <FormControl>
                      <Input placeholder="this-is-chat-name" {...field} />
                    </FormControl>
                    <FormDescription>This is your chat name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create chat</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Button variant="ghost" size="icon" onClick={() => setNewChatOpen(true)}>
        <PlusIcon className="h-4 w-4" />
      </Button>
    </>
  );
}
