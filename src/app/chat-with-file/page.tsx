"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Wand2, Send, BrainCircuit, User } from "lucide-react";
import { motion } from "framer-motion";
import { generateModuleTasks, GenerateModuleTasksOutput } from "@/ai/flows/generate-module-tasks";
import { chatWithSyllabus, Message } from "@/ai/flows/chat-with-syllabus";
import { Header } from "@/components/common/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


export default function ChatWithFilePage() {
    const [markdown, setMarkdown] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAwaitingAi, setIsAwaitingAi] = useState(false);
    const [chatTitle, setChatTitle] = useState<string>("AI Assistant");
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleGenerateTasks = async () => {
        if (!markdown.trim()) {
            setError("Please paste your syllabus content first.");
            return;
        }
        setLoading(true);
        setError(null);
        setIsAwaitingAi(true);
        setMessages([]);
        setSuggestions([]);

        // Extract title from markdown
        const lines = markdown.split('\n');
        const titleLine = lines.find(line => line.startsWith('#'));
        const extractedTitle = titleLine ? titleLine.replace(/#/g, '').trim() : "Pasted Content";
        setChatTitle(extractedTitle);

        try {
            const result = await generateModuleTasks({ 
                moduleContent: markdown, 
                moduleTitle: extractedTitle 
            });
            setMessages([
                {
                    role: "system",
                    content: `You are an expert assistant for the provided syllabus content.\n\n${markdown}`
                },
                {
                    role: "assistant",
                    content: result.introductoryMessage
                }
            ]);
            setSuggestions(result.suggestions);
        } catch (e: any) {
             setError("Failed to generate an introduction for the provided content. Please try again.");
        } finally {
            setLoading(false);
            setIsAwaitingAi(false);
        }
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
        // We need a small delay to allow the state to update before sending
        setTimeout(() => {
          document.getElementById('chat-submit-button')?.click();
        }, 50);
      };

    const handleSend = async () => {
        if (!input.trim() || isAwaitingAi) return;
        setSuggestions([]); // Clear suggestions on new message
        const userMessage: Message = { role: 'user', content: input };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setInput("");
        setLoading(true);
        setIsAwaitingAi(true);
        setError(null);
        
        try {
            const chatHistory = currentMessages.filter((m): m is { role: 'user' | 'assistant', content: string } => m.role !== 'system');
            const result = await chatWithSyllabus({ history: chatHistory, message: input });
            const assistantMessage: Message = { role: 'assistant', content: result.response };
            setMessages(msgs => [...msgs, assistantMessage]);

        } catch (e) {
            console.error("Error getting AI response:", e);
            setError("Sorry, something went wrong. Please try again.");
        } finally {
            setLoading(false);
            setIsAwaitingAi(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-muted/30 dark:bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Chat with Any Syllabus</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Paste any syllabus or educational content below. Our AI will help you understand it, generate learning tasks, and answer your questions.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <Card className="shadow-lg rounded-2xl bg-card/80 backdrop-blur-sm border">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-xl font-semibold">Your Content</h2>
                            <Textarea
                                placeholder="Paste your syllabus markdown here..."
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                rows={20}
                                className="w-full text-base rounded-xl focus-visible:ring-primary bg-background/70"
                                disabled={isAwaitingAi}
                            />
                            <Button onClick={handleGenerateTasks} disabled={loading || !markdown.trim()} className="w-full text-lg py-6 group">
                                {isAwaitingAi && loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />}
                                Generate Insights
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col h-full">
                        <Card className="flex-1 flex flex-col shadow-lg rounded-2xl h-[650px] bg-card/80 backdrop-blur-sm border">
                            <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
                               <h2 className="text-xl font-semibold mb-4 text-center truncate">{chatTitle}</h2>
                               <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                                {messages.filter(m => m.role !== 'system').length === 0 && !loading && (
                                     <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-500/30">
                                         <Sparkles className="h-4 w-4 text-primary" />
                                         <AlertTitle>Ready to Assist!</AlertTitle>
                                         <AlertDescription>
                                             Your AI study assistant will appear here once you generate insights.
                                         </AlertDescription>
                                     </Alert>
                                )}
                                 {error && (
                                    <Alert variant="destructive">
                                        <BrainCircuit className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                                     <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex items-start gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                      {msg.role === 'assistant' && (
                                        <Avatar className="w-8 h-8 border">
                                            <AvatarFallback className="bg-primary/10"><Sparkles className="h-4 w-4 text-primary" /></AvatarFallback>
                                        </Avatar>
                                      )}
                                      <div
                                        className={`max-w-md md:max-w-lg rounded-2xl px-4 py-3 text-base shadow-md prose prose-sm dark:prose-invert prose-headings:font-semibold prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 ${msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                                : 'bg-card text-card-foreground rounded-bl-none border'
                                            }`}
                                      >
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                      </div>
                                      {msg.role === 'user' && (
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
                                        </Avatar>
                                      )}
                                    </motion.div>
                                ))}
                                {loading && !isAwaitingAi && (
                                    <div className="flex justify-start items-center gap-3">
                                        <Avatar className="w-8 h-8 border"><AvatarFallback  className="bg-primary/10"><Sparkles className="h-4 w-4 text-primary" /></AvatarFallback></Avatar>
                                        <div className="flex items-center gap-2 text-muted-foreground bg-card rounded-2xl px-4 py-3 shadow-md border">
                                            <Loader2 className="h-5 w-5 animate-spin" /> AI is thinking...
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                               </div>
                                {suggestions.length > 0 && !loading && (
                                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                                    {suggestions.map((s, i) => (
                                    <Button key={i} variant="outline" size="sm" onClick={() => handleSuggestionClick(s)}>
                                        {s}
                                    </Button>
                                    ))}
                                </div>
                                )}
                            </CardContent>
                            <div className="p-4 border-t bg-card/40">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                    className="flex gap-2"
                                >
                                    <input
                                        id="chat-input-field"
                                        className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask about your syllabus..."
                                        disabled={loading || messages.length === 0}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                                    />
                                    <Button id="chat-submit-button" type="submit" size="icon" disabled={loading || !input.trim()}>
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
