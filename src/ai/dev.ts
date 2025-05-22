import { config } from 'dotenv';
config();

import '@/ai/flows/moderate-forum-posts.ts';
import '@/ai/flows/summarize-election-discussions.ts';
import '@/ai/flows/generate-participation-badge-flow.ts'; // Added new flow
