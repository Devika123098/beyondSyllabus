import { GraduationCap, MessageSquareCode, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="bg-primary/10 p-2 rounded-lg">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <span className="hidden sm:inline-block font-semibold text-xl">
            BeyondSyllabus
          </span>
        </Link>
        <div className="hidden md:flex items-center">
          {/* <Button asChild variant="ghost">
                    <Link href="/select">Select Course</Link>
                </Button> */}
          {/* <Button asChild variant="ghost">
            <Link href="/chat-with-file">
              <Sparkles className="mr-2 h-4 w-4" />
              Chat with Syllabus
            </Link>
          </Button> */}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* <div className="md:hidden">
            <MobileNav />
          </div> */}
        </div>
      </div>
    </header>
  );
}
