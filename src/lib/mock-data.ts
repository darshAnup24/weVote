import type { Election, ForumPost } from './types';

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
    endDate: new Date('2024-11-05T23:59:59Z'),
    status: 'ongoing',
  },
  {
    id: 'election-2',
    title: 'City Council Referendum',
    description: 'Vote on key local initiatives including public transport improvements and park funding.',
    candidates: [
      { id: 'option-2a', name: 'Approve Initiative A', description: 'Fund new metro lines and expand bus routes.' },
      { id: 'option-2b', name: 'Reject Initiative A', description: 'Maintain current public transport budget.' },
    ],
    startDate: new Date('2024-09-15T00:00:00Z'),
    endDate: new Date('2024-09-30T23:59:59Z'),
    status: 'completed',
  },
  {
    id: 'election-3',
    title: 'School Board Election',
    description: 'Select new members for the local school board to oversee educational policies.',
    candidates: [
      { id: 'cand-3a', name: 'Diana Prince', description: 'Experienced educator with a focus on STEM.' },
      { id: 'cand-3b', name: 'Edward Nigma', description: 'Community leader advocating for arts programs.' },
    ],
    startDate: new Date('2024-12-01T00:00:00Z'),
    endDate: new Date('2024-12-15T23:59:59Z'),
    status: 'upcoming',
  },
];

export const mockForumPosts: ForumPost[] = [
  {
    id: 'post-1',
    author: 'Anonymous',
    content: 'What are everyone\'s thoughts on the proposed education reforms? I feel like they don\'t address the core issues.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 'post-2',
    author: 'Anonymous',
    content: 'I\'m concerned about the economic impact of the latest trade agreement. Does anyone have reliable sources on this?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isFlagged: false,
  },
  {
    id: 'post-3',
    author: 'Anonymous',
    content: 'This candidate is clearly the best choice for our future. All other options are terrible. #VoteWisely',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isFlagged: true,
    flagReason: 'Potential bias and spam-like content.',
  },
  {
    id: 'post-4',
    author: 'Anonymous',
    content: 'Let\'s keep the discussion civil and focus on policies, not personal attacks. Remember the community guidelines!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];
