import { mockForumPosts } from "@/lib/mock-data";
import type { ForumPost } from "@/lib/types";
import { NewPostForm } from "@/components/discussions/new-post-form";
import { ForumPostCard } from "@/components/discussions/forum-post-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageCircle, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";


// This is a server component, so we fetch/generate data here or pass it down.
// For AI moderation, the actual check happens in a server action.
// Here, we just display posts which might have `isFlagged` property.

export default async function DiscussionsPage() {
  // In a real app, you'd fetch posts from a database
  const posts: ForumPost[] = [...mockForumPosts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-secondary text-secondary-foreground shadow">
        <MessageCircle className="h-5 w-5" />
        <AlertTitle className="font-semibold">Anonymous Discussion Forum</AlertTitle>
        <AlertDescription>
          Share your thoughts openly and anonymously. All posts are subject to AI-powered moderation to maintain a respectful environment.
          Flagged posts may be reviewed by human moderators.
        </AlertDescription>
      </Alert>

      <NewPostForm />

      <Separator />

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Recent Discussions</h2>
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <ForumPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-3 text-center h-40">
                <Info className="h-12 w-12 text-muted-foreground" />
                <p className="text-xl font-medium text-muted-foreground">No Discussions Yet</p>
                <p className="text-sm text-muted-foreground">Be the first to share your thoughts!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
