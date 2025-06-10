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
  frontendStack: z.string().describe('The preferred frontend technology stack for the solution.'),
  backendStack: z.string().describe('The preferred backend technology stack for the solution.'),
  databaseStack: z.string().describe('The preferred database technology stack for the solution.'),
});
export type GenerateBrdInput = z.infer<typeof GenerateBrdInputSchema>;

const GenerateBrdOutputSchema = z.object({
  brd: z.string().describe('The generated Business Requirements Document in Markdown format.'),
});
export type GenerateBrdOutput = z.infer<typeof GenerateBrdOutputSchema>;

export async function generateBrd(input: GenerateBrdInput): Promise<GenerateBrdOutput> {
  return generateBrdFlow(input);
}

const generateBrdPrompt = ai.definePrompt({
  name: 'generateBrdPrompt',
  input: {schema: GenerateBrdInputSchema},
  output: {schema: GenerateBrdOutputSchema},
  prompt: `You are an expert in creating Business Requirements Documents (BRDs).

  Based on the information provided, generate a complete BRD in Markdown format, following the structure below.
  This is a template and should be adapted to the specific project needs. Flesh out each section as appropriate based on the inputs and general best practices for BRDs.

  1.  **Introduction:** Purpose, Scope, Audience, Version History
  2.  **Executive Summary**
  3.  **Business Goals and Objectives:** Business Goals, Project Objectives
  4.  **Current Situation/Background:**
      *   Problem Statement: Clearly state the problem as described by the user: {{{problemStatement}}}.
      *   Current Systems and Processes (if inferable, otherwise state as TBD or make reasonable assumptions)
      *   Proposed Solution (High-Level): Detail the solution chosen by the user: {{{chosenSolution}}}.
  5.  **Project Scope:** In-Scope, Out-of-Scope
  6.  **Business Requirements**
  7.  **Stakeholder Analysis:** Identification, Roles & Responsibilities, Needs & Expectations
  8.  **Functional Requirements**: Describe the key functionalities of the proposed solution. Include some common functional requirements based on typical software applications.
  9.  **Non-Functional Requirements:** Performance, Security, Usability, Reliability, Availability, Maintainability, Portability (if applicable). Include standard non-functional requirements.
  10. **Technical Requirements:**
      *   Platform & Technology:
          *   Frontend: {{{frontendStack}}}
          *   Backend: {{{backendStack}}}
          *   Database: {{{databaseStack}}}
      *   Integration: If the solution involves APIs, outline potential API endpoints, request/response formats, and authentication methods. Generate basic, example API structures based on common web application needs.
      *   Data Migration (if applicable, make assumptions if necessary)
      *   Infrastructure (outline general needs if not specified)
  11. **Project Constraints:** Budget, Timeline, Resources, Technology, Regulatory (mention common constraints if not specified, or state as TBD)
  12. **Assumptions and Risks:** Assumptions, Risks
  13. **Acceptance Criteria**
  14. **System Diagrams (Reference):** Mention relevant diagrams like Context, Use Case, Data Flow, ERD, Component, Deployment, Integration. Define a basic data schema (conceptually an ERD) for the application, outlining key data entities and their attributes based on the problem and solution described.
  15. **Glossary**

  Ensure the BRD is well-formatted in Markdown and easy to read. Use Markdown headings for sections.
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
