export interface Candidate {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // Optional image for candidate
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
}

export interface ForumPost {
  id: string;
  author: string; // Will always be "Anonymous"
  content: string;
  timestamp: Date;
  isFlagged?: boolean;
  flagReason?: string;
  // replies?: ForumPost[]; // For nested replies, if implemented
}
