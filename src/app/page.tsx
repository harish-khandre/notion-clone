import TypewriterTitle from "@/components/ui/TypewriterTitle";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-5xl  bold mb-8"> Create notes with </h1>
      <span className="text-9xl bold ">
        <TypewriterTitle />
      </span>
      <Link href="/dashboard">
        <Button className="mt-8">
          Get Started
          <ArrowRight className="ml-2 w-5h-5" strokeWidth={3} />
        </Button>
      </Link>
    </div>
  );
}
