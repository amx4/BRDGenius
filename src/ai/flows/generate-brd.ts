// src/ai/flows/generate-brd.ts
'use server';
/**
 * @fileOverview Generates a Business Requirements Document (BRD) based on user input.
 *
 * - generateBrd - A function that generates the BRD.
 * - GenerateBrdInput - The input type for the generateBrd function.
 * - GenerateBrdOutput - The return type for the generateBrd function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBrdInputSchema = z.object({
  problemStatement: z.string().describe('The problem that the product/feature aims to address.'),
  chosenSolution: z.string().describe('The solution chosen by the user.'),
  techStack: z.string().describe('The preferred technology stack for implementing the solution.'),
});
export type GenerateBrdInput = z.infer<typeof GenerateBrdInputSchema>;

const GenerateBrdOutputSchema = z.object({
  brd: z.string().describe('The generated Business Requirements Document.'),
});
export type GenerateBrdOutput = z.infer<typeof GenerateBrdOutputSchema>;

export async function generateBrd(input: GenerateBrdInput): Promise<GenerateBrdOutput> {
  return generateBrdFlow(input);
}

const generateBrdPrompt = ai.definePrompt({
  name: 'generateBrdPrompt',
  input: {schema: GenerateBrdInputSchema},
  output: {schema: GenerateBrdOutputSchema},
  prompt: `You are an AI assistant that generates Business Requirements Documents (BRDs).

  Based on the information provided, generate a complete BRD including the following sections:

  1. Introduction: A brief overview of the purpose of the document and the product/feature being described.
  2. Problem Statement: Clearly state the problem as described by the user: {{{problemStatement}}}.
  3. Proposed Solution: Detail the solution chosen by the user: {{{chosenSolution}}}.
  4. Functional Requirements: Describe the key functionalities of the proposed solution.  Include some common functional requirements based on typical software applications.
  5. Non-Functional Requirements: Include standard non-functional requirements such as performance, security, usability, and scalability considerations.
  6. API Documentation (If Applicable): If the solution involves APIs, include a section outlining the potential API endpoints, request/response formats, and authentication methods. Generate some basic, example API structures based on common web application needs.
  7. Data Schema: Define a basic data schema for the application, outlining the key data entities and their attributes. Generate a simple, example schema based on the problem and solution described.
  8. Technology Stack: List the technologies specified by the user: {{{techStack}}}.

  Ensure the BRD is well-formatted and easy to read.
  `,
});

const generateBrdFlow = ai.defineFlow(
  {
    name: 'generateBrdFlow',
    inputSchema: GenerateBrdInputSchema,
    outputSchema: GenerateBrdOutputSchema,
  },
  async input => {
    const {output} = await generateBrdPrompt(input);
    return output!;
  }
);
