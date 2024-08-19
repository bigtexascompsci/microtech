"use client";

import { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Button } from "@/components/ui/button";

import { ArrowRightIcon } from "@radix-ui/react-icons";

async function sendMessage({
  chatId,
  content,
}: {
  chatId: number;
  content: string;
}) {
  try {
    const response = await fetch("http://localhost:3000/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId: chatId, content: content }),
    });

    if (!response.ok) {
      throw new Error("Failed to create folder");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating folder:", error);
  }
}

const formSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Chat must be at least 1 character." })
    .max(360, { message: "Folder name must be less than 360 characters." }),
});

interface SendFormProps {
  chatId: number;
  onMessageSent: () => void;
}

export function SendForm({ chatId, onMessageSent }: SendFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await sendMessage({
        chatId: chatId,
        content: values.content,
      });
      form.reset();
      if (result.success) {
        // Refresh the UI with new messages
        // For example, update state or trigger a re-fetch
        onMessageSent();
      } else {
        console.error("Failed to send message:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormMessage />
                  <FormControl>
                    <Input
                      className="h-16"
                      placeholder="Type your chat in here..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button size="icon" className="h-16 w-16">
              <ArrowRightIcon className="h-6 w-6" />
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
