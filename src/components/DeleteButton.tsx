"use client";

import React from "react";
import { Button } from "./ui/button";
import { LucideTrash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  noteId: number;
};

const DeleteButton = ({ noteId }: Props) => {
  const router = useRouter();
  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/deleteNote", {
        noteId,
      });
      return response.data;
    },
  });

  return (
    <Button
    className="mx-4"
    size={"icon"}
      variant={"destructive"}
      disabled={deleteNote.isLoading}
      onClick={() => {
        const confirm = window.confirm(
          "Are you sure you want to delete this note?"
        );
        if (!confirm) return;
        deleteNote.mutate(undefined, {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (err) => {
            console.error(err);
          },
        });
      }}
    >
      <LucideTrash2 />
    </Button>
  );
};

export default DeleteButton;
