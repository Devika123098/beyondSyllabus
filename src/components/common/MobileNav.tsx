"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, GraduationCap, Sparkles, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="p-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg mb-8"
          >
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="font-semibold">BeyondSyllabus</span>
          </Link>
          <nav className="flex flex-col gap-4">
            <MobileLink href="/select" onOpenChange={setOpen}>
              <BookOpen className="mr-3 h-5 w-5" />
              Select Course
            </MobileLink>
            <MobileLink href="/chat-with-file" onOpenChange={setOpen}>
              <Sparkles className="mr-3 h-5 w-5" />
              Chat with Syllabus
            </MobileLink>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends React.PropsWithChildren {
  href: string;
  disabled?: boolean;
  onOpenChange: (open: boolean) => void;
}

function MobileLink({ href, onOpenChange, children }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange(false);
      }}
      className="flex items-center text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
}
