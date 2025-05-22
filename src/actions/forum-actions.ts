"use server";

import { revalidatePath } from "next/cache";
import { moderateForumPost, type ModerateForumPostInput, type ModerateForumPostOutput } from "@/ai/flows/moderate-forum-posts";
import type { ForumPost } from "@/lib/types";

// In a real application, this would interact with a database.
// For now, we'll just simulate the process.
let mockPostsDb: ForumPost[] = []; // This is just for demonstration and will reset on server restart.

interface CreatePostResult {
  success: boolean;
  post?: ForumPost;
  isFlagged?: boolean;
  reason?: string;
  error?: string;
}

export async function createForumPost(content: string): Promise<CreatePostResult> {
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
      author: "Anonymous",
      content: content,
      timestamp: new Date(),
      isFlagged: moderationResult.isFlagged,
      flagReason: moderationResult.isFlagged ? moderationResult.reason : undefined,
    };

    // Simulate saving to DB
    mockPostsDb.unshift(newPost); 
    // In a real app, you'd save newPost to your database here.
    // console.log("New post created (mock):", newPost);

    revalidatePath("/discussions"); // Revalidate the discussions page to show the new post

    return {
      success: true,
      post: newPost,
      isFlagged: newPost.isFlagged,
      reason: newPost.flagReason,
    };

  } catch (error) {
    console.error("Error creating forum post:", error);
    // Check if error is an instance of Error to safely access message
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during moderation or post creation.";
    return { success: false, error: errorMessage };
  }
}

// Example function to get posts (replace with actual DB query)
// This is not directly used by the client in this setup but shows how you might retrieve posts
export async function getForumPosts(): Promise<ForumPost[]> {
  // In a real app, fetch from database
  // return mockPostsDb.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  // For this example, mock data is directly imported in the page component.
  // This function is here as a conceptual placeholder.
  return []; 
}
