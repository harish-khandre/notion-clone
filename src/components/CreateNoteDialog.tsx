"use client";

import axios from "axios";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, PlusCircleIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Props = {};

const CreateNoteDialog = (props: Props) => {

  const router = useRouter()
  const { toast } = useToast();

  const [input, setInput] = useState("");

  const uploadToFirebase = useMutation({
    mutationFn: async (noteId: string) => {
    const response =  await axios.post('/api/uploadToFirebase', {
        noteId
      })
      return response.data
    }
  })

  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createNoteBook", {
        name: input,
      });
      return response.data;
    },
  });

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNotebook.mutate(undefined, {
      onSuccess: ({note_id}) => {
        console.log("created new note");
        uploadToFirebase.mutate(note_id)
        router.push(`/notebook/${note_id}`)
      },
      onError: (error: any) => {
        toast({ variant: "destructive", description: error });
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 border-primary h-full rounded-2xl  items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex flex-row p-4 m-4">
          <PlusCircleIcon className="w-6 h-6 " strokeWidth={3} />
          <h2 className="font-semibold  sm:mt-2">New Note Page</h2>
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="">New Note Page</DialogTitle>
          <DialogDescription className="">
            Your can create a new Page by clicking the button below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handelSubmit}>
          <Input
            required
            placeholder="Page name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="h-4"></div>
          <div className="flex items-center justify-end gap-4">
            {/* <Button type="reset" variant="destructive">
              Cancel
            </Button> */}
            <Button disabled={createNotebook.isLoading} type="submit">
              {createNotebook.isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
