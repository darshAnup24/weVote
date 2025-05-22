import { config } from 'dotenv';
config();

import '@/ai/flows/moderate-forum-posts.ts';
import '@/ai/flows/summarize-election-discussions.ts';