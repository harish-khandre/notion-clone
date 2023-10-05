import Tiptap from '@/components/Tiptap'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { $notes } from '@/lib/db/schema/schema'
import { auth } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { clerk } from "@/lib/clerk-server";
import { ModeToggle } from '@/components/mode-toggle'
import DeleteButton from '@/components/DeleteButton'


type Props = {
  params : {
    noteId: string
  }
}

const NotebookPage = async ({params: {noteId}}: Props) => {

  

  const { userId } = await auth();
  if (!userId) {
    return redirect("/dashboard");
  }
  const user = await clerk.users.getUser(userId);
  if(!userId){
    return redirect ("/dashboard")
  }


  const notes = await db
    .select()
    .from($notes)
    .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));
  const note = notes[0]
  return (
    <div className="h-screen p-8 lg:w-4/5 md:w-screen mx-auto  ">
      <div className=" mx-auto">
        <div className="border shadow-xl border-primary rounded-2xl py-2 px-4 flex-items-center flex gap-4 justify-center items-center">
          <Link href="/dashboard">
            <Button variant={"ghost"}>
              <Home size={30} />
            </Button>
          </Link>

          <span className="font-semibold text-xl">
            {user.firstName} / {note.name}
          </span>
          <div className="ml-auto">
          <DeleteButton noteId={note.id} />
            <ModeToggle  />
          </div>
        </div>
        <Tiptap note={note} />
      </div>
    </div>
  );
}

export default NotebookPage