"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  BookOpenCheck,
  BarChart3,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export default function Home() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isNavigatingToChat, setIsNavigatingToChat] = useState(false);

  const handleExploreClick = async () => {
    setIsNavigating(true);
    
    // Add aesthetic delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 800));
    
    router.push("/select");
  };

  const handleChatClick = async () => {
    setIsNavigatingToChat(true);
    
    // Add aesthetic delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 600));
    
    router.push("/chat-with-file");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <section className="w-full py-20 md:py-32 bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.2]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Welcome to BeyondSyllabus
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Your modern, AI-powered guide to the university curriculum.
                    Explore subjects, understand modules, and unlock your
                    potential.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button 
                    size="lg" 
                    className="group shadow-lg relative overflow-hidden transition-all duration-300" 
                    onClick={handleExploreClick}
                    disabled={isNavigating}
                  >
                    {isNavigating ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Loading Syllabus...
                      </>
                    ) : (
                      <>
                        Explore Your Syllabus{" "}
                        <ChevronRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                    {isNavigating && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-white/30 to-primary/20 animate-shimmer" />
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="group shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={handleChatClick}
                    disabled={isNavigatingToChat}
                  >
                    {isNavigatingToChat ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin text-amber-400" />
                        Loading AI Chat...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2 text-amber-400" />
                        AI Chat
                      </>
                    )}
                    {isNavigatingToChat && (
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-white/20 to-amber-400/10 animate-shimmer" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/studying.jpg"
                  width="600"
                  height="400"
                  alt="Students studying in a modern library"
                  data-ai-hint="modern library students"
                  className="mx-auto aspect-video overflow-hidden rounded-2xl object-cover shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 bg-card border-y">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-slate-950/20 px-3 py-1 text-sm font-medium">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Learn Smarter, Not Harder
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to streamline your learning process,
                  from understanding complex topics to finding the best study
                  materials.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <FeatureCard
                icon={<BookOpenCheck className="h-8 w-8 text-primary" />}
                title="Structured Syllabus"
                description="Access your complete university syllabus, broken down by program, semester, and subject."
              />
              <FeatureCard
                icon={<GraduationCap className="h-8 w-8 text-primary" />}
                title="AI-Powered Insights"
                description="Get concise summaries of your syllabus modules and chat with an AI to grasp key concepts quickly."
              />
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8 text-primary" />}
                title="Learning Tools"
                description="Generate learning tasks and discover real-world applications for each module to deepen your understanding."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-transparent shadow-none text-center hover:bg-slate-950/20 hover:shadow-lg transition-colors rounded-2xl py-4">
      <CardHeader className="items-center gap-4">
        <div className="bg-primary/10 p-4 rounded-full">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
