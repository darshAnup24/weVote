import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Vote, MessageSquare } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to VoteWise!</CardTitle>
          <CardDescription className="text-lg">
            Your platform for secure, anonymous voting and open discussions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            Navigate using the sidebar to cast your vote in ongoing elections or participate in community discussions.
            VoteWise is committed to ensuring the integrity of elections and fostering a respectful environment for dialogue.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/voting" passHref legacyBehavior>
              <Button variant="default" size="lg" className="w-full">
                <Vote className="mr-2 h-5 w-5" />
                Go to Voting
              </Button>
            </Link>
            <Link href="/discussions" passHref legacyBehavior>
              <Button variant="outline" size="lg" className="w-full">
                <MessageSquare className="mr-2 h-5 w-5" />
                Join Discussions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To provide a trustworthy and transparent platform for democratic processes and public discourse,
              empowering individuals to make their voices heard securely and anonymously.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Secure & Anonymous Voting</li>
              <li>End-to-End Vote Encryption (Conceptual)</li>
              <li>Anonymous Discussion Forum</li>
              <li>AI-Powered Content Moderation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
