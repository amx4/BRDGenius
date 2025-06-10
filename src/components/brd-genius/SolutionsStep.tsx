"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2, ChevronRight, ChevronLeft } from "lucide-react";

interface SolutionsStepProps {
  problemStatement: string;
  suggestedSolutions: string[];
  onSelect: (solution: string) => void;
  onBack: () => void;
  isLoading: boolean; // Loading for *this step's action*, not overall suggestions loading
  isSuggestionsLoading: boolean; // Specifically for when solutions are being fetched
  initialSelection?: string;
}

export function SolutionsStep({
  problemStatement,
  suggestedSolutions,
  onSelect,
  onBack,
  isLoading,
  isSuggestionsLoading,
  initialSelection,
}: SolutionsStepProps) {
  const [selectedSolution, setSelectedSolution] = useState<string | undefined>(initialSelection);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSolution(initialSelection);
  }, [initialSelection]);

  const handleSubmit = () => {
    if (!selectedSolution) {
      setError("Please select a solution.");
      return;
    }
    setError(null);
    onSelect(selectedSolution);
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center space-x-2 text-primary mb-2">
          <Lightbulb className="w-6 h-6" />
          <CardTitle className="font-headline text-2xl">Potential Solutions</CardTitle>
        </div>
        <CardDescription>
          Based on your problem statement, here are some potential solutions. Please choose the one that best fits your vision.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border rounded-md bg-muted/50">
          <h4 className="font-semibold mb-1 text-sm">Problem Statement:</h4>
          <p className="text-sm text-muted-foreground italic">{problemStatement}</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSuggestionsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border rounded-md">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : suggestedSolutions.length > 0 ? (
          <RadioGroup value={selectedSolution} onValueChange={setSelectedSolution} disabled={isLoading}>
            {suggestedSolutions.map((solution, index) => (
              <Label
                key={index}
                htmlFor={`solution-${index}`}
                className={`flex items-start space-x-3 p-4 border rounded-md hover:border-primary cursor-pointer transition-colors ${selectedSolution === solution ? 'border-primary ring-2 ring-primary' : ''}`}
              >
                <RadioGroupItem value={solution} id={`solution-${index}`} className="mt-1" />
                <span className="text-sm font-medium">{solution}</span>
              </Label>
            ))}
          </RadioGroup>
        ) : (
          <Alert>
            <AlertTitle>No Solutions Suggested</AlertTitle>
            <AlertDescription>
              The AI could not suggest any solutions based on the problem statement. You can go back and refine it or proceed if you have a solution in mind (though this step might not be as effective).
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <Button onClick={onBack} variant="outline" disabled={isLoading || isSuggestionsLoading} className="w-full sm:w-auto">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || isSuggestionsLoading || !selectedSolution} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ChevronRight className="mr-2 h-4 w-4" />
            )}
            Next: Tech Stack
          </Button>
        </div>
      </CardContent>
    </>
  );
}
