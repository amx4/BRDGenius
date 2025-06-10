"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code, Loader2, ChevronRight, ChevronLeft } from "lucide-react";

export interface TechStackData {
  frontend: string;
  backend: string;
  database: string;
}

interface TechStackStepProps {
  onSubmit: (techStack: TechStackData) => void;
  onBack: () => void;
  initialValue: TechStackData;
  isLoading: boolean;
}

export function TechStackStep({ onSubmit, onBack, initialValue, isLoading }: TechStackStepProps) {
  const [frontendStack, setFrontendStack] = useState(initialValue?.frontend || '');
  const [backendStack, setBackendStack] = useState(initialValue?.backend || '');
  const [databaseStack, setDatabaseStack] = useState(initialValue?.database || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFrontendStack(initialValue?.frontend || '');
    setBackendStack(initialValue?.backend || '');
    setDatabaseStack(initialValue?.database || '');
  }, [initialValue]);

  const handleSubmit = () => {
    if (!frontendStack.trim() || !backendStack.trim() || !databaseStack.trim()) {
      setError("All technology stack fields (Frontend, Backend, Database) are required.");
      return;
    }
    setError(null);
    onSubmit({
      frontend: frontendStack,
      backend: backendStack,
      database: databaseStack,
    });
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center space-x-2 text-primary mb-2">
          <Code className="w-6 h-6" />
          <CardTitle className="font-headline text-2xl">Technology Stack</CardTitle>
        </div>
        <CardDescription>
          Specify the programming languages, frameworks, and databases for your solution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="frontend-stack">Frontend Technologies</Label>
          <Textarea
            id="frontend-stack"
            placeholder="e.g., React, Next.js, Vue, Angular, Tailwind CSS..."
            value={frontendStack}
            onChange={(e) => setFrontendStack(e.target.value)}
            rows={3}
            className="text-base"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="backend-stack">Backend Technologies</Label>
          <Textarea
            id="backend-stack"
            placeholder="e.g., Node.js, Express, Python, Django, Java, Spring Boot..."
            value={backendStack}
            onChange={(e) => setBackendStack(e.target.value)}
            rows={3}
            className="text-base"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="database-stack">Database Technologies</Label>
          <Textarea
            id="database-stack"
            placeholder="e.g., PostgreSQL, MongoDB, MySQL, Firebase Firestore..."
            value={databaseStack}
            onChange={(e) => setDatabaseStack(e.target.value)}
            rows={3}
            className="text-base"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
          <Button onClick={onBack} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !frontendStack.trim() || !backendStack.trim() || !databaseStack.trim()} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
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
