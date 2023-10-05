"use client";
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useDebounce } from "./useDebounce";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NoteType } from "@/lib/db/schema/schema";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import Text from "@tiptap/extension-text";
import { useCompletion } from "ai/react";
import { Loader2 } from "lucide-react";

type Props = { note: NoteType };

const Tiptap = ({ note }: Props) => {
  const [editorState, setEditorState] = React.useState(
    note.editorState || `<h1>${note.name}</h1>`
  );

  const { complete, completion } = useCompletion({
    api: "/api/completion",
  });

  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
      });
      return response.data;
    },
  });

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-a": () => {
          const prompt = this.editor.getText().split("").slice(-100).join(" ");
          complete(prompt);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, Underline, Text, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const lastCompletion = React.useRef("");

  React.useEffect(() => {
    if (!editor || !completion) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    editor?.commands.insertContent(diff);
  }, [completion, editor]);

  const debouncedEditorState = useDebounce(editorState, 500);
  React.useEffect(() => {
    // save to db
    if (debouncedEditorState === "") return;
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log("success update!", data);
      },
      onError: (err) => {
        console.error(err);
      },
    });
  }, [debouncedEditorState, saveNote]);

  return (
    <>
      <div className="flex justify-center items-center ">
        {editor && <TipTapMenuBar editor={editor} />}
        <Button className="self-center mt-6 ml-2" disabled variant={"ghost"}>
          {saveNote.isSuccess ? (
           "saved"
          ) : saveNote.isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> <p>Saving</p>
            </>
          ) : (
            "Failed to save"
          )}
        </Button>
      </div>
      <div className="prose prose-sm w-full mt-4 m-auto">
        <EditorContent editor={editor} />
        <div className="h-4"></div>
        <span className="text-sm">Tip: Press </span>
        <kbd className="px-2 py-1.5 text-xs font-semibold  border  rounded-lg ">
          Shift + A
        </kbd>{" "}
        for AI Auto-Completion
      </div>
    </>
  );
};

export default Tiptap;
