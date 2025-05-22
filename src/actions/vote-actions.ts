
"use server";

import { revalidatePath } from "next/cache";
import type { VoteRecord } from "@/lib/types";
import { mockUserVotes, mockCurrentUser, mockElections } from "@/lib/mock-data"; // Assuming mockUserVotes is an array in mock-data

export interface RecordVoteInput {
  userId: string;
  electionId: string;
  candidateId: string;
}

interface RecordVoteResult {
  success: boolean;
  error?: string;
  alreadyVoted?: boolean;
}

export async function recordVote(data: RecordVoteInput): Promise<RecordVoteResult> {
  try {
    if (!mockCurrentUser || mockCurrentUser.id !== data.userId) {
      return { success: false, error: "User authentication failed or mismatch." };
    }

    const election = mockElections.find(e => e.id === data.electionId);
    if (!election) {
      return { success: false, error: "Election not found." };
    }
    if (election.status !== 'ongoing') {
      return { success: false, error: "This election is not currently ongoing." };
    }

    // Check if user is allowed to vote (if allowedVoters list exists)
    if (election.allowedVoters && election.allowedVoters.length > 0) {
      if (!mockCurrentUser.email || !election.allowedVoters.includes(mockCurrentUser.email.toLowerCase())) {
        return { success: false, error: "User is not authorized to vote in this election." };
      }
    }
    
    const hasVoted = mockUserVotes.some(
      vote => vote.userId === data.userId && vote.electionId === data.electionId
    );

    if (hasVoted) {
      return { success: false, error: "User has already voted in this election.", alreadyVoted: true };
    }

    const newVote: VoteRecord = {
      ...data,
      timestamp: new Date(),
    };

    mockUserVotes.push(newVote);

    // Also update the mockCurrentUser's votedInElections array for client-side checks if needed,
    // though the primary source of truth for "hasVoted" should be mockUserVotes.
    if (mockCurrentUser.votedInElections) {
        if (!mockCurrentUser.votedInElections.includes(data.electionId)){
            mockCurrentUser.votedInElections.push(data.electionId);
        }
    } else {
        mockCurrentUser.votedInElections = [data.electionId];
    }
    
    // console.log("Vote recorded (mock):", newVote);
    // console.log("Current user voted list (mock):", mockCurrentUser.votedInElections);
    // console.log("All votes (mock):", mockUserVotes);


    revalidatePath(`/voting/${data.electionId}`); // Revalidate the election page
    revalidatePath("/voting"); // Revalidate election listing if it shows vote counts/status

    return { success: true };

  } catch (error) {
    console.error("Error recording vote:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred while recording the vote.";
    return { success: false, error: errorMessage };
  }
}

export async function checkIfUserVoted(userId: string, electionId: string): Promise<boolean> {
  // This is a helper that might be called on the client to quickly check status
  // For robust checks, rely on recordVote action's internal logic before actual vote submission
  return mockUserVotes.some(
    vote => vote.userId === userId && vote.electionId === electionId
  );
}
