
// src/ai/flows/generate-brd.ts
'use server';
/**
 * @fileOverview Generates a Business Requirements Document (BRD) based on user input and a provided structure.
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
  brdStructure: z.string().describe('The user-defined Markdown structure/template for the BRD.'),
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
You will be provided with a BRD structure template in Markdown, a problem statement, a chosen solution, and technology stack preferences.
Your task is to populate the provided BRD structure with relevant information based on these inputs and general best practices for BRDs.

Use the following BRD structure template as the primary guide for your response:
\`\`\`markdown
{{{brdStructure}}}
\`\`\`

Populate this template using the following information:
- Problem Statement: {{{problemStatement}}}
- Chosen Solution: {{{chosenSolution}}}
- Frontend Stack: {{{frontendStack}}}
- Backend Stack: {{{backendStack}}}
- Database Stack: {{{databaseStack}}}

Flesh out each section of the provided template as comprehensively as possible, replacing placeholders like "{{projectName}}" or instructions in parentheses with specific details.
If some information cannot be directly inferred, use your expertise to suggest typical content for that section or indicate it as "To Be Determined (TBD)" or "Not Applicable (N/A)" where appropriate.
Ensure the final output is a complete BRD in valid Markdown format, based on the structure provided.
Focus on filling the given structure, not creating a new one.
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
