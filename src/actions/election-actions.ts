
"use server";

import { revalidatePath } from "next/cache";
import type { Election, Candidate } from "@/lib/types";
import { mockElections } from "@/lib/mock-data"; // We'll add to this list

export interface CreateElectionInput {
  title: string;
  description: string;
  candidateNames: string; // Comma-separated or newline-separated
  candidateDescriptions: string; // Corresponding descriptions, newline-separated
  voterEmails: string; // Comma-separated or newline-separated
  startDate: string;
  endDate: string;
}

interface CreateElectionResult {
  success: boolean;
  election?: Election;
  error?: string;
}

// Helper function to generate unique IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

export async function createElection(data: CreateElectionInput): Promise<CreateElectionResult> {
  try {
    if (!data.title || data.title.trim().length < 5) {
      return { success: false, error: "Election title must be at least 5 characters long." };
    }
    if (!data.description || data.description.trim().length < 10) {
      return { success: false, error: "Election description must be at least 10 characters long." };
    }
    if (!data.candidateNames || data.candidateNames.trim() === "") {
      return { success: false, error: "Please provide at least one candidate name." };
    }
     if (!data.startDate || !data.endDate) {
      return { success: false, error: "Start and end dates are required." };
    }
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (startDate >= endDate) {
      return { success: false, error: "Start date must be before end date." };
    }
    if (endDate <= new Date()) {
      return { success: false, error: "End date must be in the future." };
    }


    const candidateNameList = data.candidateNames.split(/[\n,]+/).map(name => name.trim()).filter(name => name);
    const candidateDescList = data.candidateDescriptions.split('\n').map(desc => desc.trim());


    if (candidateNameList.length === 0) {
        return { success: false, error: "At least one valid candidate name is required." };
    }
     if (candidateNameList.length !== candidateDescList.length && candidateDescList.some(d => d !== '')) {
      return { success: false, error: "Number of candidate names and descriptions must match, or descriptions can be left empty to be filled in later." };
    }


    const candidates: Candidate[] = candidateNameList.map((name, index) => ({
      id: generateId('cand'),
      name,
      description: candidateDescList[index] || `Details for ${name}`, // Default description
      imageUrl: `https://placehold.co/300x300.png?text=${encodeURIComponent(name.substring(0,1))}`,
      dataAiHint: 'person avatar'
    }));

    const allowedVoters = data.voterEmails
      .split(/[\n,]+/)
      .map(email => email.trim().toLowerCase())
      .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)); // Basic email validation

    const newElection: Election = {
      id: generateId('election'),
      title: data.title,
      description: data.description,
      candidates,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: new Date(data.startDate) > new Date() ? 'upcoming' : 'ongoing', // Basic status logic
      allowedVoters: allowedVoters.length > 0 ? allowedVoters : undefined, // Only add if emails provided
      imageUrl: `https://placehold.co/600x300.png?text=${encodeURIComponent(data.title)}`,
      dataAiHint: 'election event'
    };

    // Simulate saving to DB by pushing to the mock array
    mockElections.unshift(newElection);
    // console.log("New election created (mock):", newElection);

    revalidatePath("/voting"); // Revalidate the main voting page to show the new election
    revalidatePath("/elections/create"); // To clear the form potentially

    return { success: true, election: newElection };

  } catch (error) {
    console.error("Error creating election:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during election creation.";
    return { success: false, error: errorMessage };
  }
}
