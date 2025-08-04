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

  const handleUniversitySelect = (universityId: string) => {
    setSelectedUniversityId(universityId);
    setStep(2);
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedProgramId(programId);
    setStep(3);
  };

  const handleSchemeSelect = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      selectedUniversityId &&
      selectedProgramId &&
      selectedSchemeId &&
      selectedSemesterId
    ) {
      router.push(
        `/${selectedUniversityId}/${selectedProgramId}/${selectedSchemeId}/${selectedSemesterId}`
      );
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
        <CardContent className="space-y-8 min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
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
                    {Object.keys(directoryStructure).map((universityId) => (
                      <Card
                        key={universityId}
                        className="cursor-pointer hover:border-primary transition-all p-4 text-center group hover:shadow-lg"
                        onClick={() => handleUniversitySelect(universityId)}
                      >
                        <GraduationCap className="h-8 w-8 text-primary mx-auto mb-2 transition-transform group-hover:scale-110" />
                        <p className="font-semibold text-lg">
                          {capitalizeWords(universityId)}
                        </p>
                      </Card>
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
