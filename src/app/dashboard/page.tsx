import CreateNoteDialog from "@/components/CreateNoteDialog";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema/schema";
import { UserButton, auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

type Props = {};

const DashboardPage = async (props: Props) => {
  const { userId } = auth();

  const notes = await db
    .select()
    .from($notes)
    .where(eq($notes.userId, userId!));

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <div className="self-center">
          <Link href="/">
            <ArrowLeftCircle className="my-4 mx-4 w-8 h-8" />
          </Link>
        </div>
        <div className=" my-4 mx-4 self-center h-8 w-8">
          <UserButton />
        </div>
        <div className="my-4 mx-4 self-center h-8 w-8">
          <ModeToggle />
        </div>
      </div>
      <div>
        <h1 className="text-4xl  text-center  font-bold">My Notes</h1>
        <Separator className="my-10" />
      </div>
      {notes.length === 0 && (
        <div className="  text-center">
          <h2 className="text-xl text-secondary ">No Notes Yet</h2>
        </div>
      )}

      <div className="grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3">
        <CreateNoteDialog />

        {notes.map((note) => {
          return (
            <a href={`/notebook/${note.id}`} key={note.id}>
              <div className="border  rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                <Image
                  width={400}
                  height={200}
                  alt={note.name}
                  src={note.imageUrl || ""}
                  quality={"100"}
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold ">{note.name}</h3>
                  <div className="h-1"></div>
                  <p className="text-sm text-secondary-foreground ">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
};

export default DashboardPage;
