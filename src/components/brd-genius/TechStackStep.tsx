"use client";

import type React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code, Loader2, ChevronRight, ChevronLeft } from "lucide-react";

interface TechStackStepProps {
  onSubmit: (techStack: string) => void;
  onBack: () => void;
  initialValue: string;
  isLoading: boolean;
}

export function TechStackStep({ onSubmit, onBack, initialValue, isLoading }: TechStackStepProps) {
  const [techStack, setTechStack] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!techStack.trim()) {
      setError("Technology stack cannot be empty.");
      return;
    }
    setError(null);
    onSubmit(techStack);
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center space-x-2 text-primary mb-2">
          <Code className="w-6 h-6" />
          <CardTitle className="font-headline text-2xl">Technology Stack</CardTitle>
        </div>
        <CardDescription>
          What programming languages, frameworks, databases, or other technologies do you envision using for this solution?
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
          <Label htmlFor="tech-stack" className="sr-only">Technology Stack</Label>
          <Textarea
            id="tech-stack"
            placeholder="e.g., React, Next.js, Node.js, PostgreSQL, AWS..."
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            rows={8}
            className="text-base"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <Button onClick={onBack} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !techStack.trim()} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
               <ChevronRight className="mr-2 h-4 w-4" />
            )}
            Generate BRD
          </Button>
        </div>
      </CardContent>
    </>
  );
}
