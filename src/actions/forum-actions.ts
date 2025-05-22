
"use server";

import { revalidatePath } from "next/cache";
import { moderateForumPost, type ModerateForumPostInput, type ModerateForumPostOutput } from "@/ai/flows/moderate-forum-posts";
import type { ForumPost } from "@/lib/types";
import { initialMockForumPosts } from "@/lib/mock-data"; // Using initial data to populate

// In a real application, this would interact with a database.
// For now, we'll simulate the process with an in-memory array.
// Initialize with some mock data.
let mockPostsDb: ForumPost[] = [...initialMockForumPosts];

interface CreatePostResult {
  success: boolean;
  post?: ForumPost;
  isFlagged?: boolean;
  reason?: string;
  error?: string;
}

export async function createForumPost(electionId: string, content: string): Promise<CreatePostResult> {
  if (!electionId) {
    return { success: false, error: "Election ID is required to create a post." };
  }
  if (!content || content.trim().length < 10) {
    return { success: false, error: "Post content must be at least 10 characters long." };
  }
  if (content.trim().length > 1000) {
    return { success: false, error: "Post content must be at most 1000 characters long." };
  }

  try {
    // Moderate the post content using AI
    const moderationInput: ModerateForumPostInput = { text: content };
    const moderationResult: ModerateForumPostOutput = await moderateForumPost(moderationInput);

    const newPost: ForumPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      electionId: electionId,
      author: "Anonymous", // Discussions are anonymous
      content: content,
      timestamp: new Date(),
      isFlagged: moderationResult.isFlagged,
      flagReason: moderationResult.isFlagged ? moderationResult.reason : undefined,
    };

    mockPostsDb.unshift(newPost); 
    // console.log("New post created (mock):", newPost);

    revalidatePath(`/voting/${electionId}`); // Revalidate the specific election page to show the new post

    return {
      success: true,
      post: newPost,
      isFlagged: newPost.isFlagged,
      reason: newPost.flagReason,
    };

  } catch (error) {
    console.error("Error creating forum post:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during moderation or post creation.";
    return { success: false, error: errorMessage };
  }
}

export async function getForumPosts(electionId: string): Promise<ForumPost[]> {
  // In a real app, fetch from database filtered by electionId
  // For this example, filter the in-memory DB.
  const electionPosts = mockPostsDb
    .filter(post => post.electionId === electionId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  return electionPosts;
}
