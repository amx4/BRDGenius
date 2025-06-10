"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogoIcon } from '@/components/icons/LogoIcon';
import { StepIndicator } from '@/components/brd-genius/StepIndicator';
import { ProblemStatementStep } from '@/components/brd-genius/ProblemStatementStep';
import { SolutionsStep } from '@/components/brd-genius/SolutionsStep';
import { TechStackStep } from '@/components/brd-genius/TechStackStep';
import { BrdDisplayStep } from '@/components/brd-genius/BrdDisplayStep';

import { suggestSolutions, type SuggestSolutionsInput, type SuggestSolutionsOutput } from '@/ai/flows/suggest-solutions';
import { generateBrd, type GenerateBrdInput, type GenerateBrdOutput } from '@/ai/flows/generate-brd';
import { useToast } from "@/hooks/use-toast";

export default function BrdGeniusPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [problemStatement, setProblemStatement] = useState('');
  const [suggestedSolutionsList, setSuggestedSolutionsList] = useState<string[]>([]);
  const [chosenSolution, setChosenSolution] = useState('');
  const [techStack, setTechStack] = useState('');
  const [generatedBrdContent, setGeneratedBrdContent] = useState('');

  const [isLoading, setIsLoading] = useState(false); // General loading for submissions
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false); // Specific for fetching solutions
  
  const { toast } = useToast();

  const totalSteps = 4;
  const brdFileName = "BRDGenius_Document";

  // Persist state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('brdGeniusState');
    if (savedState) {
      const {
        currentStep,
        problemStatement,
        suggestedSolutionsList,
        chosenSolution,
        techStack,
        generatedBrdContent,
      } = JSON.parse(savedState);
      setCurrentStep(currentStep || 1);
      setProblemStatement(problemStatement || '');
      setSuggestedSolutionsList(suggestedSolutionsList || []);
      setChosenSolution(chosenSolution || '');
      setTechStack(techStack || '');
      setGeneratedBrdContent(generatedBrdContent || '');
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      currentStep,
      problemStatement,
      suggestedSolutionsList,
      chosenSolution,
      techStack,
      generatedBrdContent,
    };
    localStorage.setItem('brdGeniusState', JSON.stringify(stateToSave));
  }, [currentStep, problemStatement, suggestedSolutionsList, chosenSolution, techStack, generatedBrdContent]);


  const handleProblemSubmit = async (problem: string) => {
    setProblemStatement(problem);
    setIsSuggestionsLoading(true);
    setIsLoading(true);
    try {
      const input: SuggestSolutionsInput = { problemStatement: problem };
      const result: SuggestSolutionsOutput = await suggestSolutions(input);
      if (result.solutions && result.solutions.length > 0) {
        setSuggestedSolutionsList(result.solutions);
        setCurrentStep(2);
      } else {
        setSuggestedSolutionsList([]); // Ensure it's an empty array
        toast({
          title: "No Solutions Found",
          description: "AI couldn't suggest solutions. Try rephrasing your problem or proceed.",
          variant: "default",
        });
        setCurrentStep(2); // Still go to next step to allow manual progression or retry
      }
    } catch (error) {
      console.error("Error suggesting solutions:", error);
      toast({
        title: "Error Suggesting Solutions",
        description: "Failed to get suggestions from AI. Please try again.",
        variant: "destructive",
      });
      setSuggestedSolutionsList([]);
    } finally {
      setIsSuggestionsLoading(false);
      setIsLoading(false);
    }
  };

  const handleSolutionSelect = (solution: string) => {
    setChosenSolution(solution);
    setCurrentStep(3);
  };

  const handleTechStackSubmit = async (stack: string) => {
    setTechStack(stack);
    setIsLoading(true);
    setGeneratedBrdContent(''); // Clear previous BRD content
    setCurrentStep(4); // Move to BRD display step to show loading
    try {
      const input: GenerateBrdInput = {
        problemStatement,
        chosenSolution,
        techStack: stack,
      };
      const result: GenerateBrdOutput = await generateBrd(input);
      setGeneratedBrdContent(result.brd);
      toast({
        title: "BRD Generated!",
        description: "Your Business Requirements Document is ready.",
        variant: "default", // Use 'default' which maps to accent via globals.css
        className: "bg-accent text-accent-foreground border-accent"
      });
    } catch (error) {
      console.error("Error generating BRD:", error);
      setGeneratedBrdContent('');
      toast({
        title: "Error Generating BRD",
        description: "Failed to generate the BRD. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setProblemStatement('');
    setSuggestedSolutionsList([]);
    setChosenSolution('');
    setTechStack('');
    setGeneratedBrdContent('');
    setIsLoading(false);
    setIsSuggestionsLoading(false);
    localStorage.removeItem('brdGeniusState');
    toast({
      title: "Restarted",
      description: "The process has been reset.",
    });
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProblemStatementStep
            onSubmit={handleProblemSubmit}
            initialValue={problemStatement}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <SolutionsStep
            problemStatement={problemStatement}
            suggestedSolutions={suggestedSolutionsList}
            onSelect={handleSolutionSelect}
            onBack={handleBack}
            isLoading={isLoading && !isSuggestionsLoading} // general loading if not suggestions loading
            isSuggestionsLoading={isSuggestionsLoading}
            initialSelection={chosenSolution}
          />
        );
      case 3:
        return (
          <TechStackStep
            onSubmit={handleTechStackSubmit}
            onBack={handleBack}
            initialValue={techStack}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <BrdDisplayStep
            brd={generatedBrdContent}
            isLoading={isLoading} // This isLoading is for BRD generation itself
            onRestart={handleRestart}
            fileName={brdFileName}
          />
        );
      default:
        return <p>Unknown step</p>;
    }
  };

  return (
    <main className="flex flex-grow flex-col items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-2xl shadow-2xl rounded-xl overflow-hidden">
        <div className="p-6 bg-card flex items-center space-x-3 border-b">
          <LogoIcon className="text-primary" />
          <h1 className="text-3xl font-headline font-semibold text-foreground">BRDGenius</h1>
        </div>
        
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        {renderStepContent()}
      </Card>
      <footer className="text-center mt-8 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BRDGenius. Powered by AI.</p>
      </footer>
    </main>
  );
}
