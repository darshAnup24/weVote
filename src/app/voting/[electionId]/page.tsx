
"use client";

import { useParams, useRouter } from 'next/navigation';
import { mockElections, mockCurrentUser } from '@/lib/mock-data';
import type { Candidate, Election as ElectionType, ForumPost } from '@/lib/types';
import { CandidateCard } from '@/components/voting/candidate-card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, ArrowLeft, Info, Vote, MessageSquare, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewPostForm } from '@/components/discussions/new-post-form';
import { ForumPostCard } from '@/components/discussions/forum-post-card';
import { getForumPosts } from '@/actions/forum-actions'; // To fetch posts for this election
import { Separator } from '@/components/ui/separator';

export default function ElectionVotingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const electionId = params.electionId as string;
  
  const [election, setElection] = useState<ElectionType | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAllowedToVote, setIsAllowedToVote] = useState<boolean | undefined>(undefined); // undefined means loading/not checked
  const [electionPosts, setElectionPosts] = useState<ForumPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    const foundElection = mockElections.find(e => e.id === electionId);
    if (foundElection) {
      setElection(foundElection);

      // Simulate authentication check for voting
      if (mockCurrentUser && foundElection.allowedVoters && foundElection.allowedVoters.length > 0) {
        setIsAllowedToVote(foundElection.allowedVoters.includes(mockCurrentUser.email.toLowerCase()));
      } else if (mockCurrentUser) {
        setIsAllowedToVote(true); // No specific voter list, so any authenticated user can vote
      } else {
        setIsAllowedToVote(false); // Not authenticated
      }

      // Fetch forum posts for this election
      const fetchPosts = async () => {
        setIsLoadingPosts(true);
        try {
          const posts = await getForumPosts(electionId);
          setElectionPosts(posts);
        } catch (error) {
          console.error("Failed to fetch posts:", error);
          toast({ title: "Error", description: "Could not load discussion posts.", variant: "destructive" });
        } finally {
          setIsLoadingPosts(false);
        }
      };
      fetchPosts();

    } else {
      toast({ title: "Error", description: "Election not found.", variant: "destructive" });
      router.push('/voting');
    }
  }, [electionId, router, toast]);

  if (!election || isAllowedToVote === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
        <Info className="h-8 w-8 mr-2 animate-spin mb-2" /> 
        <p>Loading election details...</p>
        <p className="text-sm">Please wait a moment.</p>
      </div>
    );
  }

  if (election.status !== 'ongoing') {
    return (
      <div className="space-y-6">
        <Button variant="outline" asChild className="mb-4">
            <Link href="/voting">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Elections
            </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{election.title}</CardTitle>
            <CardDescription>This election is not currently active for voting.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Status: <span className="font-semibold">{election.status.charAt(0).toUpperCase() + election.status.slice(1)}</span></p>
            <p>Please check back if it's an upcoming election, or view results if it's completed (feature pending).</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleVoteSubmit = () => {
    if (!selectedCandidate) {
      toast({ title: "No Selection", description: "Please select a candidate to vote.", variant: "destructive" });
      return;
    }
    if (!isAllowedToVote) {
       toast({ title: "Voting Restricted", description: "You are not authorized to vote in this election or not logged in.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Vote Submitted!",
        description: `You successfully voted for ${election.candidates.find(c => c.id === selectedCandidate)?.name}. Thank you for participating!`,
        className: "bg-accent text-accent-foreground border-accent-foreground/20"
      });
      setIsSubmitting(false);
      router.push('/voting'); 
    }, 1500);
  };

  const votingContent = (
    <>
      <Alert variant="default" className="mb-6 bg-primary/10 border-primary/50">
        <Shield className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary">Your Vote is Secure</AlertTitle>
        <AlertDescription className="text-primary/90">
          All votes are processed with security and anonymity in mind. 
          End-to-end encryption would be implemented in a production system.
        </AlertDescription>
      </Alert>

      {!isAllowedToVote && mockCurrentUser && (
         <Alert variant="destructive" className="mb-6">
            <Lock className="h-5 w-5" />
            <AlertTitle className="font-semibold">Voting Restricted</AlertTitle>
            <AlertDescription>
              Your email ({mockCurrentUser.email}) is not on the list of allowed voters for this election.
              If you believe this is an error, please contact the election administrator.
            </AlertDescription>
          </Alert>
      )}
      {!mockCurrentUser && (
         <Alert variant="destructive" className="mb-6">
            <Lock className="h-5 w-5" />
            <AlertTitle className="font-semibold">Authentication Required</AlertTitle>
            <AlertDescription>
              You must be logged in to vote. Currently, authentication is simulated.
              A full login system would be present in a real application.
            </AlertDescription>
          </Alert>
      )}


      <h3 className="text-xl font-semibold mb-4">Select Your Choice:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {election.candidates.map((candidate: Candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            isSelected={selectedCandidate === candidate.id}
            onSelect={() => setSelectedCandidate(candidate.id)}
          />
        ))}
      </div>
      <Button 
        size="lg" 
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90" 
        onClick={handleVoteSubmit}
        disabled={!selectedCandidate || isSubmitting || !isAllowedToVote}
      >
        {isSubmitting ? 'Submitting...' : `Submit Vote for ${election.candidates.find(c => c.id === selectedCandidate)?.name || ''}`}
      </Button>
    </>
  );

  const discussionContent = (
    <div className="mt-6">
        <Alert variant="default" className="mb-6 bg-secondary text-secondary-foreground shadow">
            <MessageSquare className="h-5 w-5" />
            <AlertTitle className="font-semibold">Anonymous Discussion for "{election.title}"</AlertTitle>
            <AlertDescription>
            Share your thoughts openly and anonymously regarding this election. All posts are subject to AI-powered moderation.
            </AlertDescription>
        </Alert>
        <NewPostForm electionId={election.id} />
        <Separator className="my-8" />
         <h2 className="text-2xl font-semibold mb-6 text-foreground">Recent Discussions</h2>
        {isLoadingPosts ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
                <Info className="h-6 w-6 mr-2 animate-spin" /> Loading discussions...
            </div>
        ) : electionPosts.length > 0 ? (
          <div className="space-y-6">
            {electionPosts.map((post) => (
              <ForumPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-3 text-center h-40">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
                <p className="text-xl font-medium text-muted-foreground">No Discussions Yet</p>
                <p className="text-sm text-muted-foreground">Be the first to share your thoughts on this election!</p>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Button variant="outline" asChild>
        <Link href="/voting">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Elections
        </Link>
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-card">
          <CardTitle className="text-3xl font-bold text-primary">{election.title}</CardTitle>
          <CardDescription className="text-lg">{election.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="vote" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none">
              <TabsTrigger value="vote" className="py-3 text-base rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
                <Vote className="mr-2 h-5 w-5" /> Vote
              </TabsTrigger>
              <TabsTrigger value="discussion" className="py-3 text-base rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
                <MessageSquare className="mr-2 h-5 w-5" /> Discussion
              </TabsTrigger>
            </TabsList>
            <TabsContent value="vote" className="p-6">
              {votingContent}
            </TabsContent>
            <TabsContent value="discussion" className="p-6">
              {discussionContent}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
