"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Computer,
  Cog,
  HardHat,
  CircuitBoard,
  Bolt,
  Info,
  ChevronRight,
  GraduationCap,
  Building,
  BookOpen,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SyllabusDataStructure {
  [key: string]: any;
}

interface SelectionFormProps {
  directoryStructure: SyllabusDataStructure;
}

const programIcons: { [key: string]: React.ElementType } = {
  "computer-science": Computer,
  "mechanical-engineering": Cog,
  "civil-engineering": HardHat,
  "electronics-communication-engineering": CircuitBoard,
  "electrical-electronics-engineering": Bolt,
};

function capitalizeWords(str: string | undefined): string {
  if (!str) return "";
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatSemesterName(semesterId: string): string {
  if (!semesterId) return "";
  return `Semester ${semesterId.replace("s", "").replace(/^0+/, "")}`;
}

const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const MotionDiv = motion.div;

export function SelectionForm({ directoryStructure }: SelectionFormProps) {
  const router = useRouter();

  const [selectedUniversityId, setSelectedUniversityId] = useState<
    string | null
  >(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null
  );
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(
    null
  );
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleUniversitySelect = async (universityId: string) => {
    setIsLoading(true);
    setLoadingMessage('Loading programs...');
    
    // Add aesthetic delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setSelectedUniversityId(universityId);
    setIsLoading(false);
    setStep(2);
  };

  const handleProgramSelect = async (programId: string) => {
    setIsLoading(true);
    setLoadingMessage('Loading schemes...');
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setSelectedProgramId(programId);
    setIsLoading(false);
    setStep(3);
  };

  const handleSchemeSelect = async (schemeId: string) => {
    setIsLoading(true);
    setLoadingMessage('Loading semesters...');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSelectedSchemeId(schemeId);
    setIsLoading(false);
    setStep(4);
  };

  const handleSemesterSelect = (semesterId: string) => {
    setSelectedSemesterId(semesterId);
  };

  const resetToLevel = (level: number) => {
    if (level <= 1) {
      setSelectedUniversityId(null);
      setSelectedProgramId(null);
      setSelectedSchemeId(null);
      setSelectedSemesterId(null);
    } else if (level === 2) {
      setSelectedProgramId(null);
      setSelectedSchemeId(null);
      setSelectedSemesterId(null);
    } else if (level === 3) {
      setSelectedSchemeId(null);
      setSelectedSemesterId(null);
    } else if (level === 4) {
      setSelectedSemesterId(null);
    }
    setStep(level);
  };

  const selectedUniversityData = selectedUniversityId
    ? directoryStructure[selectedUniversityId]
    : null;
  const selectedProgramData =
    selectedUniversityData && selectedProgramId
      ? selectedUniversityData[selectedProgramId]
      : null;
  const selectedSchemeData =
    selectedProgramData && selectedSchemeId
      ? selectedProgramData[selectedSchemeId]
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUniversityId && selectedProgramId && selectedSchemeId && selectedSemesterId) {
      setIsLoading(true);
      setLoadingMessage('Loading syllabus modules...');
      
      // Add a delay before navigation to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push(`/${selectedUniversityId}/${selectedProgramId}/${selectedSchemeId}/${selectedSemesterId}`);
    }
  };

  return (
    <Card className="w-full md:-w-[100%]  shadow-2xl rounded-2xl bg-card/80 backdrop-blur-sm">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center font-bold">
            Find Your Syllabus
          </CardTitle>
          <CardDescription className="text-center">
            Follow the steps to find the curriculum for your course.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <MotionDiv 
                key="loading" 
                variants={stepVariants} 
                initial="hidden" 
                animate="visible" 
                exit="exit" 
                className="w-full text-center space-y-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                    <Loader2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <h3 className="text-xl font-semibold text-primary">{loadingMessage}</h3>
                    <p className="text-muted-foreground">Please wait while we prepare your content...</p>
                    <div className="flex justify-center space-x-1 mt-4">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </motion.div>
                </div>
              </MotionDiv>
            ) : (
              <>
            {step === 1 && (
              <MotionDiv
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-center block">
                    1. Select Your University
                  </Label>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.keys(directoryStructure).map(universityId => (
                      <motion.div
                        key={universityId}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Card
                          className="cursor-pointer hover:border-primary transition-all duration-300 p-6 text-center group hover:shadow-xl hover:bg-primary/5 border-2 backdrop-blur-sm"
                          onClick={() => handleUniversitySelect(universityId)}
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <GraduationCap className="h-12 w-12 text-primary mx-auto mb-3 transition-all duration-300 group-hover:text-primary/80" />
                          </motion.div>
                          <p className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">{capitalizeWords(universityId)}</p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </MotionDiv>
            )}

            {step === 2 && selectedUniversityData && (
              <MotionDiv
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-center block">
                    2. Choose Your Program
                  </Label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {Object.keys(selectedUniversityData).map((programId) => {
                      const Icon =
                        programIcons[programId.replace(/-/g, "")] || Computer;
                      return (
                        <Card
                          key={programId}
                          className="cursor-pointer hover:border-primary transition-all text-center p-6 group hover:shadow-lg"
                          onClick={() => handleProgramSelect(programId)}
                        >
                          <Icon className="h-10 w-10 text-primary mx-auto mb-3 transition-transform group-hover:scale-110" />
                          <p className="font-semibold capitalize">
                            {programId.replace(/-/g, " ")}
                          </p>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </MotionDiv>
            )}

            {step === 3 && selectedProgramData && (
              <MotionDiv
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-center">
                    <Label htmlFor="scheme" className="text-lg font-semibold">
                      3. Select Your Scheme
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Your syllabus depends on the academic scheme you
                            follow.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    onValueChange={handleSchemeSelect}
                    value={selectedSchemeId ?? ""}
                    name="scheme"
                  >
                    <SelectTrigger id="scheme" className="py-6 text-base">
                      <SelectValue placeholder="Select Scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(selectedProgramData).map((schemeId) => (
                        <SelectItem
                          key={schemeId}
                          value={schemeId}
                          className="capitalize"
                        >
                          {schemeId.replace(/-/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </MotionDiv>
            )}

            {step === 4 && selectedSchemeData && (
              <MotionDiv
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-center block">
                    4. Pick Your Semester
                  </Label>
                  <RadioGroup
                    onValueChange={handleSemesterSelect}
                    value={selectedSemesterId ?? ""}
                    className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                  >
                    {Object.keys(selectedSchemeData).map((semesterId) => (
                      <Label
                        key={semesterId}
                        htmlFor={semesterId}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer hover:border-primary transition-all hover:shadow-lg",
                          selectedSemesterId === semesterId &&
                            "border-primary bg-primary/10 shadow-lg"
                        )}
                      >
                        <RadioGroupItem
                          value={semesterId}
                          id={semesterId}
                          className="sr-only"
                        />
                        <BookOpen className="h-6 w-6 mb-2 text-primary" />
                        <p className="font-semibold">
                          {formatSemesterName(semesterId)}
                        </p>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              </MotionDiv>
            )}
            </>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-muted/50 p-4 rounded-b-2xl">
          <Button
            variant="ghost"
            type="button"
            onClick={() => resetToLevel(step - 1)}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="group"
            disabled={!selectedSemesterId}
          >
            View Subjects{" "}
            <ChevronRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
