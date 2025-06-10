
"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogoIcon } from '@/components/icons/LogoIcon';
import { StepIndicator } from '@/components/brd-genius/StepIndicator';
import { ProblemStatementStep } from '@/components/brd-genius/ProblemStatementStep';
import { SolutionsStep } from '@/components/brd-genius/SolutionsStep';
import { TechStackStep, type TechStackData } from '@/components/brd-genius/TechStackStep';
import { BrdStructureStep } from '@/components/brd-genius/BrdStructureStep';
import { BrdDisplayStep } from '@/components/brd-genius/BrdDisplayStep';

import { suggestSolutions, type SuggestSolutionsInput, type SuggestSolutionsOutput } from '@/ai/flows/suggest-solutions';
import { generateBrd, type GenerateBrdInput, type GenerateBrdOutput } from '@/ai/flows/generate-brd';
import { useToast } from "@/hooks/use-toast";

const DEFAULT_BRD_STRUCTURE = `
# Business Requirements Document: {{projectName}}

## 1. Introduction
   - **Purpose:** (Briefly state the purpose of this document and the project.)
   - **Scope:** (Define what the project will and will not cover.)
   - **Audience:** (Identify the intended audience for this BRD.)
   - **Version History:** (Track changes to this document.)

## 2. Executive Summary
   (Provide a high-level overview of the project, including the problem, proposed solution, and key benefits.)

## 3. Business Goals and Objectives
   - **Business Goals:** (List the strategic business goals this project supports.)
   - **Project Objectives:** (State specific, measurable, achievable, relevant, and time-bound (SMART) objectives for the project.)

## 4. Current Situation/Background
   - **Problem Statement:** {{{problemStatement}}}
   - **Current Systems and Processes:** (Describe any existing systems or processes relevant to the problem, or state as TBD.)
   - **Proposed Solution (High-Level):** {{{chosenSolution}}}

## 5. Project Scope
   - **In-Scope:** (Detail specific functionalities and deliverables included in the project.)
   - **Out-of-Scope:** (Explicitly list functionalities and deliverables not included.)

## 6. Business Requirements
   (List detailed business needs that the solution must meet. E.g., "The system must allow users to track inventory levels.")

## 7. Stakeholder Analysis
   - **Identification:** (List key stakeholders.)
   - **Roles & Responsibilities:** (Describe their roles in the project.)
   - **Needs & Expectations:** (Outline what each stakeholder needs from the solution.)

## 8. Functional Requirements
   (Describe the specific actions or capabilities the system must perform. E.g., "FR-001: User Registration - The system shall allow new users to create an account.")

## 9. Non-Functional Requirements
   - **Performance:** (E.g., "The system should load key pages within 3 seconds.")
   - **Security:** (E.g., "All user data must be encrypted at rest and in transit.")
   - **Usability:** (E.g., "The interface should be intuitive for non-technical users.")
   - **Reliability:** (E.g., "The system should have an uptime of 99.9%.")
   - **Availability:** (E.g., "The system must be accessible 24/7, excluding scheduled maintenance.")
   - **Maintainability:** (E.g., "Code should be well-documented and follow project coding standards.")
   - **Portability:** (If applicable, e.g., "The application should run on modern web browsers.")

## 10. Technical Requirements
   - **Platform & Technology:**
     - Frontend: {{{frontendStack}}}
     - Backend: {{{backendStack}}}
     - Database: {{{databaseStack}}}
   - **Integration (APIs):** (Outline potential API endpoints, request/response formats, authentication methods if known. E.g., "API for customer data: GET /api/customers, POST /api/customers")
   - **Data Migration:** (Describe plan if data needs to be moved from old systems, or state as TBD/Not Applicable.)
   - **Infrastructure:** (General needs, e.g., "Cloud-based hosting, scalable database solution.")

## 11. Project Constraints
   - **Budget:** (TBD or specify if known.)
   - **Timeline:** (TBD or specify if known.)
   - **Resources:** (TBD or specify if known.)
   - **Technology:** (Reiterate or add specific constraints.)
   - **Regulatory:** (List any compliance or regulatory requirements, e.g., GDPR, HIPAA.)

## 12. Assumptions and Risks
   - **Assumptions:** (List any assumptions made during the requirements gathering.)
   - **Risks:** (Identify potential risks and mitigation strategies.)

## 13. Acceptance Criteria
   (Define how the successful completion of requirements will be verified. E.g., "User can successfully register an account and log in.")

## 14. System Diagrams (Reference)
   (Mention relevant diagrams to be created, e.g., Context Diagram, Use Case Diagram, Data Flow Diagram, Entity Relationship Diagram (ERD), Component Diagram, Deployment Diagram, Integration Diagram. For ERD, conceptually outline key data entities and their attributes based on {{{chosenSolution}}}.)

## 15. Glossary
   (Define any terms or acronyms specific to the project or domain.)
`;


export default function BrdGeniusPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [problemStatement, setProblemStatement] = useState('');
  const [suggestedSolutionsList, setSuggestedSolutionsList] = useState<string[]>([]);
  const [chosenSolution, setChosenSolution] = useState('');
  const [techStack, setTechStack] = useState<TechStackData>({ frontend: '', backend: '', database: '' });
  const [brdStructureTemplate, setBrdStructureTemplate] = useState<string>(DEFAULT_BRD_STRUCTURE);
  const [generatedBrdContent, setGeneratedBrdContent] = useState(''); // Raw AI output
  const [editedBrdContent, setEditedBrdContent] = useState(''); // User-editable version

  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const { toast } = useToast();

  const totalSteps = 5;
  const brdFileName = "BRDGenius_Document";

  useEffect(() => {
    const savedStateString = localStorage.getItem('brdGeniusState');
    if (savedStateString) {
      try {
        const savedState = JSON.parse(savedStateString);
        setCurrentStep(savedState.currentStep || 1);
        setProblemStatement(savedState.problemStatement || '');
        setSuggestedSolutionsList(savedState.suggestedSolutionsList || []);
        setChosenSolution(savedState.chosenSolution || '');
        if (typeof savedState.techStack === 'string') {
          setTechStack({ frontend: savedState.techStack, backend: '', database: '' });
        } else {
          setTechStack(savedState.techStack || { frontend: '', backend: '', database: '' });
        }
        setBrdStructureTemplate(savedState.brdStructureTemplate || DEFAULT_BRD_STRUCTURE);
        setGeneratedBrdContent(savedState.generatedBrdContent || '');
        setEditedBrdContent(savedState.editedBrdContent || savedState.generatedBrdContent || '');

      } catch (error) {
        console.error("Error parsing saved state from localStorage:", error);
        localStorage.removeItem('brdGeniusState');
      }
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      currentStep,
      problemStatement,
      suggestedSolutionsList,
      chosenSolution,
      techStack,
      brdStructureTemplate,
      generatedBrdContent,
      editedBrdContent,
    };
    localStorage.setItem('brdGeniusState', JSON.stringify(stateToSave));
  }, [currentStep, problemStatement, suggestedSolutionsList, chosenSolution, techStack, brdStructureTemplate, generatedBrdContent, editedBrdContent]);


  const handleProblemSubmit = async (problem: string) => {
    setProblemStatement(problem);
    setIsSuggestionsLoading(true);
    setIsLoading(true);
    try {
      const input: SuggestSolutionsInput = { problemStatement: problem };
      const result: SuggestSolutionsOutput = await suggestSolutions(input);
      if (result.solutions && result.solutions.length > 0) {
        setSuggestedSolutionsList(result.solutions);
      } else {
        setSuggestedSolutionsList([]);
        toast({
          title: "No Solutions Found",
          description: "AI couldn't suggest solutions. Try rephrasing or proceed with your own.",
          variant: "default",
        });
      }
      setCurrentStep(2);
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

  const handleTechStackSubmit = (stacks: TechStackData) => {
    setTechStack(stacks);
    setCurrentStep(4); // Move to BRD Structure step
  };

  const handleBrdStructureSubmit = async (structure: string) => {
    setBrdStructureTemplate(structure);
    setIsLoading(true);
    setGeneratedBrdContent('');
    setEditedBrdContent('');
    setCurrentStep(5); // Move to BRD Display step

    try {
      const input: GenerateBrdInput = {
        problemStatement,
        chosenSolution,
        frontendStack: techStack.frontend,
        backendStack: techStack.backend,
        databaseStack: techStack.database,
        brdStructure: structure,
      };
      const result: GenerateBrdOutput = await generateBrd(input);
      setGeneratedBrdContent(result.brd);
      setEditedBrdContent(result.brd); // Initialize editable content with generated BRD
      toast({
        title: "BRD Generated!",
        description: "Your Business Requirements Document is ready for review.",
        variant: "default",
        className: "bg-accent text-accent-foreground border-accent"
      });
    } catch (error) {
      console.error("Error generating BRD:", error);
      setGeneratedBrdContent('');
      setEditedBrdContent('');
      toast({
        title: "Error Generating BRD",
        description: "Failed to generate the BRD. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBrdContentChange = (newContent: string) => {
    setEditedBrdContent(newContent);
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
    setTechStack({ frontend: '', backend: '', database: '' });
    setBrdStructureTemplate(DEFAULT_BRD_STRUCTURE);
    setGeneratedBrdContent('');
    setEditedBrdContent('');
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
            isLoading={isLoading && !isSuggestionsLoading}
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
          <BrdStructureStep
            onSubmit={handleBrdStructureSubmit}
            onBack={handleBack}
            initialValue={brdStructureTemplate}
            isLoading={isLoading}
          />
        );
      case 5:
        return (
          <BrdDisplayStep
            brdContent={editedBrdContent}
            isLoading={isLoading}
            onRestart={handleRestart}
            fileName={brdFileName}
            onBrdContentChange={handleBrdContentChange}
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
