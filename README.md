
# BRDGenius - AI-Powered Business Requirements Document Generator

BRDGenius is a Next.js application designed to assist users in generating Business Requirements Documents (BRDs) through a guided, multi-step process powered by AI. It leverages Genkit for AI functionalities, ShadCN UI for components, and Tailwind CSS for styling.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Environment Variables](#environment-variables)
  - [Local Development](#local-development)
  - [Genkit Development](#genkit-development)
- [Building and Running with Docker](#building-and-running-with-docker)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)

## Features

-   **Guided BRD Creation:** Step-by-step process to gather necessary information.
-   **AI-Powered Suggestions:** AI assists in generating potential solutions based on the problem statement.
-   **Customizable BRD Structure:** Users can define or modify the Markdown template for their BRD.
-   **Technology Stack Input:** Specify frontend, backend, and database technologies.
-   **BRD Generation:** AI populates the BRD template based on user inputs.
-   **Editable Output:** Review and edit the generated BRD directly in the app.
-   **Multiple Download Formats:** Download the BRD as TXT, Markdown, or DOCX.
-   **Persistent State:** Form progress is saved to local storage.

## Tech Stack

-   **Framework:** Next.js (App Router)
-   **AI Integration:** Genkit (with Google AI/Gemini models)
-   **UI Components:** ShadCN UI
-   **Styling:** Tailwind CSS
-   **Language:** TypeScript
-   **Form Handling:** React Hook Form
-   **Markdown Processing:** `marked`
-   **DOCX Generation:** `html-to-docx`
-   **File Saving:** `file-saver`

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)
-   [Docker](https://www.docker.com/products/docker-desktop/) (optional, for containerized deployment)
-   A Google AI API Key (for Genkit to function). You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Getting Started

### Environment Variables

1.  Create a `.env` file in the root of the project (if it doesn't exist).
    ```bash
    touch .env
    ```
2.  Add your Google AI API key to the `.env` file:
    ```env
    GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
    ```
    Replace `YOUR_GOOGLE_API_KEY` with your actual API key. Genkit uses this key to authenticate requests to Google AI models.

### Local Development

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd brdgenius-app # Or your project's directory name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    The application will typically run on `http://localhost:9002`.
    ```bash
    npm run dev
    ```

### Genkit Development

Genkit flows are defined in `src/ai/flows/`. To run the Genkit development server (which allows youto inspect and test flows via the Genkit Developer UI, typically at `http://localhost:4000`):

1.  **Start the Genkit development server:**
    ```bash
    npm run genkit:dev
    ```
    Or, to watch for changes:
    ```bash
    npm run genkit:watch
    ```
    The Next.js app (`npm run dev`) should be running concurrently for the Genkit flows to be callable from the UI.

## Building and Running with Docker

A `Dockerfile` is provided to containerize the application.

1.  **Build the Docker image:**
    From the root of the project, run:
    ```bash
    docker build -t brdgenius .
    ```
    If your Genkit/Google AI API key is required during the build process (it's usually a runtime variable, but if needed for build):
    ```bash
    docker build --build-arg GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY -t brdgenius .
    ```

2.  **Run the Docker container:**
    This command maps port 9002 on your host to port 3000 inside the container (which is what Next.js uses by default).
    ```bash
    docker run -p 9002:3000 -e GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY brdgenius
    ```
    Replace `YOUR_GOOGLE_API_KEY` with your actual API key.
    The application will be accessible at `http://localhost:9002`.

    You can also use the provided `docker-compose.yml`:
    ```bash
    # Ensure your .env file has GOOGLE_API_KEY set
    docker-compose up --build
    ```
    This will also map port 9002 to 3000.

## Project Structure

-   `src/app/`: Next.js App Router pages and layouts.
    -   `src/app/page.tsx`: Main application page for BRDGenius.
    -   `src/app/globals.css`: Global styles and Tailwind CSS theme.
-   `src/components/`: React components.
    -   `src/components/ui/`: ShadCN UI components.
    -   `src/components/brd-genius/`: Components specific to the BRDGenius steps.
    -   `src/components/icons/`: Custom SVG icons.
-   `src/ai/`: Genkit related files.
    -   `src/ai/genkit.ts`: Genkit initialization and configuration.
    -   `src/ai/flows/`: Genkit flows for AI interactions (e.g., `suggest-solutions.ts`, `generate-brd.ts`).
    -   `src/ai/dev.ts`: Entry point for Genkit development server.
-   `src/lib/`: Utility functions.
    -   `src/lib/utils.ts`: General utility functions (e.g., `cn` for classnames).
    -   `src/lib/download.ts`: Functions for downloading generated files.
-   `src/hooks/`: Custom React hooks (e.g., `useToast`, `useMobile`).
-   `public/`: Static assets.
-   `Dockerfile`: Configuration for building the Docker image.
-   `docker-compose.yml`: Docker Compose configuration.
-   `next.config.ts`: Next.js configuration.
-   `tailwind.config.ts`: Tailwind CSS configuration.
-   `components.json`: ShadCN UI configuration.

## How It Works

BRDGenius guides the user through a series of steps to create a BRD:

1.  **Problem Statement:** The user describes the problem their product or feature aims to solve.
2.  **Suggest Solutions:** AI (Genkit flow `suggestSolutions`) generates potential solutions based on the problem statement. The user selects one.
3.  **Tech Stack:** The user specifies their preferred frontend, backend, and database technologies.
4.  **BRD Structure:** The user reviews and can customize a default Markdown template for the BRD. This template includes placeholders like `{{{problemStatement}}}`, `{{{chosenSolution}}}`, etc.
5.  **Generate & Display BRD:** AI (Genkit flow `generateBrd`) populates the chosen BRD structure template with the information gathered in previous steps. The generated BRD is displayed in a textarea for review and editing. The user can then download the BRD in TXT, Markdown, or DOCX format.

The application state (current step, inputs, generated content) is persisted in the browser's local storage to allow users to resume their progress.
```