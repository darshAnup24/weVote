export interface Candidate {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // Optional image for candidate
  dataAiHint?: string; // For placeholder image generation
  votes?: number; // Optional: for displaying results if ever needed
}

export interface Election {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'ongoing' | 'completed';
  allowedVoters?: string[]; // List of emails allowed to vote
  imageUrl?: string; // For the election card
  dataAiHint?: string; // For placeholder image generation for election card
}

export interface ForumPost {
  id: string;
  author: string; // Will always be "Anonymous"
  content: string;
  timestamp: Date;
  electionId: string; // To scope discussions to an election
  isFlagged?: boolean;
  flagReason?: string;
  // replies?: ForumPost[]; // For nested replies, if implemented
}

export interface User {
  id: string;
  email: string;
  name?: string;
  votedInElections?: string[]; // Array of election IDs the user has voted in
}

// To store vote counts and who voted for whom (simplified)
export interface VoteRecord {
  electionId: string;
  userId: string;
  candidateId: string;
  timestamp: Date;
}
