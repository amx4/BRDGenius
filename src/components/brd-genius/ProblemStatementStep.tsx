"use client";

import type React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HelpCircle, Loader2, ChevronRight } from "lucide-react";

interface ProblemStatementStepProps {
  onSubmit: (problem: string) => void;
  initialValue: string;
  isLoading: boolean;
}

export function ProblemStatementStep({ onSubmit, initialValue, isLoading }: ProblemStatementStepProps) {
  const [problem, setProblem] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!problem.trim()) {
      setError("Problem statement cannot be empty.");
      return;
    }
    setError(null);
    onSubmit(problem);
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center space-x-2 text-primary mb-2">
          <HelpCircle className="w-6 h-6" />
          <CardTitle className="font-headline text-2xl">Problem Statement</CardTitle>
        </div>
        <CardDescription>
          Describe the problem your product or feature aims to address. This will help in generating relevant solutions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div>
          <Label htmlFor="problem-statement" className="sr-only">Problem Statement</Label>
          <Textarea
            id="problem-statement"
            placeholder="e.g., Users are struggling to manage their daily tasks efficiently..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={8}
            className="text-base"
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleSubmit} disabled={isLoading || !problem.trim()} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ChevronRight className="mr-2 h-4 w-4" />
          )}
          Next: Suggest Solutions
        </Button>
      </CardContent>
    </>
  );
}
