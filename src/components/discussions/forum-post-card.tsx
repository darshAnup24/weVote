import type { ForumPost } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle, Flag, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface ForumPostCardProps {
  post: ForumPost;
}

export function ForumPostCard({ post }: ForumPostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              <UserCircle className="h-6 w-6 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-medium">Anonymous User</CardTitle>
            <p className="text-xs text-muted-foreground flex items-center">
              <Clock className="mr-1 h-3 w-3" /> {timeAgo}
            </p>
          </div>
        </div>
        {post.isFlagged !== undefined && (
          post.isFlagged ? (
            <Badge variant="destructive" className="whitespace-nowrap">
              <Flag className="mr-1.5 h-3.5 w-3.5" />
              Flagged
            </Badge>
          ) : (
            <Badge variant="secondary" className="whitespace-nowrap bg-accent/20 text-accent-foreground hover:bg-accent/30 border-accent/30">
              <CheckCircle className="mr-1.5 h-3.5 w-3.5 text-accent" />
              Moderated
            </Badge>
          )
        )}
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm leading-relaxed text-foreground/90">{post.content}</p>
      </CardContent>
      {post.isFlagged && post.flagReason && (
        <CardFooter className="text-xs text-destructive bg-destructive/10 p-3 border-t">
          <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
          <p><span className="font-semibold">Moderation Note:</span> {post.flagReason}</p>
        </CardFooter>
      )}
    </Card>
  );
}
