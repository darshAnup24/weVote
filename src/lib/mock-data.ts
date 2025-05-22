import type { Election, ForumPost, User, VoteRecord } from './types';

export const mockCurrentUser: User | null = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  votedInElections: [], // Initialize as empty, will be updated by actions/state
};
// To simulate a logged-out state, set mockCurrentUser to null
// export const mockCurrentUser: User | null = null;


export const mockElections: Election[] = [
  {
    id: 'election-1',
    title: 'Presidential Election 2024',
    description: 'Choose the next president to lead the nation for the upcoming term. Your vote shapes the future.',
    candidates: [
      { id: 'cand-1a', name: 'Alice Wonderland', description: 'Focused on innovation and technology.', imageUrl: 'https://placehold.co/300x300.png', dataAiHint: 'woman politician' },
      { id: 'cand-1b', name: 'Bob The Builder', description: 'Prioritizing infrastructure and job creation.', imageUrl: 'https://placehold.co/300x300.png', dataAiHint: 'man builder' },
      { id: 'cand-1c', name: 'Charlie Brown', description: 'Advocating for environmental protection and social justice.', imageUrl: 'https://placehold.co/300x300.png', dataAiHint: 'person thinking' },
    ],
    startDate: new Date('2024-10-01T00:00:00Z'),
    endDate: new Date('2029-11-05T23:59:59Z'), // Extended for testing
    status: 'ongoing',
    allowedVoters: ['test@example.com', 'voter1@example.com', 'voter2@example.com'],
    imageUrl: 'https://placehold.co/600x300.png?text=Presidential+Election+2024',
    dataAiHint: 'election voting'
  },
  {
    id: 'election-2',
    title: 'City Council Referendum',
    description: 'Vote on key local initiatives including public transport improvements and park funding.',
    candidates: [
      { id: 'option-2a', name: 'Approve Initiative A', description: 'Fund new metro lines and expand bus routes.', dataAiHint: 'public transport' },
      { id: 'option-2b', name: 'Reject Initiative A', description: 'Maintain current public transport budget.', dataAiHint: 'budget chart' },
    ],
    startDate: new Date('2024-09-15T00:00:00Z'),
    endDate: new Date('2024-09-30T23:59:59Z'),
    status: 'completed',
    allowedVoters: ['test@example.com', 'localresident@example.com'],
    imageUrl: 'https://placehold.co/600x300.png?text=City+Council+Referendum',
    dataAiHint: 'cityscape referendum'
  },
  {
    id: 'election-3',
    title: 'School Board Election',
    description: 'Select new members for the local school board to oversee educational policies.',
    candidates: [
      { id: 'cand-3a', name: 'Diana Prince', description: 'Experienced educator with a focus on STEM.', dataAiHint: 'teacher classroom' },
      { id: 'cand-3b', name: 'Edward Nigma', description: 'Community leader advocating for arts programs.', dataAiHint: 'community leader' },
    ],
    startDate: new Date('2025-01-01T00:00:00Z'), // Future date
    endDate: new Date('2025-01-15T23:59:59Z'),
    status: 'upcoming',
    allowedVoters: ['parent@example.com', 'teacher@example.com', 'test@example.com'],
    imageUrl: 'https://placehold.co/600x300.png?text=School+Board+Election',
    dataAiHint: 'school building'
  },
];

// This mockForumPosts array is now just initial data.
// The forum-actions.ts will manage the "live" DB.
export const initialMockForumPosts: ForumPost[] = [
  {
    id: 'post-1',
    electionId: 'election-1',
    author: 'Anonymous',
    content: 'What are everyone\'s thoughts on the proposed education reforms for election-1? I feel like they don\'t address the core issues.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 'post-2',
    electionId: 'election-1',
    author: 'Anonymous',
    content: 'I\'m concerned about the economic impact of the latest trade agreement discussed in election-1. Does anyone have reliable sources on this?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isFlagged: false,
  },
  {
    id: 'post-3',
    electionId: 'election-2',
    author: 'Anonymous',
    content: 'This candidate for election-2 is clearly the best choice for our future. All other options are terrible. #VoteWisely',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isFlagged: true,
    flagReason: 'Potential bias and spam-like content.',
  },
];

// In-memory store for recorded votes (simulates a database)
export const mockUserVotes: VoteRecord[] = [];
