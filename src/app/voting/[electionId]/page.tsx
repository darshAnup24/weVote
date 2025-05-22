
"use client";

import { useParams, useRouter } from 'next/navigation';
import { mockElections, mockCurrentUser, mockUserVotes } from '@/lib/mock-data';
import type { Candidate, Election as ElectionType, ForumPost } from '@/lib/types';
import { CandidateCard } from '@/components/voting/candidate-card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, ArrowLeft, Info, Vote, MessageSquare, Lock, CheckCircle, PartyPopper } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewPostForm } from '@/components/discussions/new-post-form';
import { ForumPostCard } from '@/components/discussions/forum-post-card';
import { getForumPosts } from '@/actions/forum-actions';
import { recordVote, checkIfUserVoted } from '@/actions/vote-actions';
import { generateParticipationBadge, type GenerateParticipationBadgeInput } from '@/ai/flows/generate-participation-badge-flow';
import { Separator } from '@/components/ui/separator';
import { RadioGroup } from "@/components/ui/radio-group";
import Image from 'next/image';

export default function ElectionVotingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const electionId = params.electionId as string;
  
  const [election, setElection] = useState<ElectionType | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [isAllowedToVoteCheck, setIsAllowedToVoteCheck] = useState<boolean | undefined>(undefined);
  const [hasVotedInThisElection, setHasVotedInThisElection] = useState<boolean | undefined>(undefined);
  const [participationBadgeUrl, setParticipationBadgeUrl] = useState<string | null>(null);
  const [badgeMessage, setBadgeMessage] = useState<string | null>(null);
  const [isGeneratingBadge, setIsGeneratingBadge] = useState(false);

  const [electionPosts, setElectionPosts] = useState<ForumPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const fetchElectionData = useCallback(async () => {
    const foundElection = mockElections.find(e => e.id === electionId);
    if (foundElection) {
      setElection(foundElection);

      if (mockCurrentUser) {
        // Check if allowed by voter list
        if (foundElection.allowedVoters && foundElection.allowedVoters.length > 0) {
          setIsAllowedToVoteCheck(foundElection.allowedVoters.includes(mockCurrentUser.email.toLowerCase()));
        } else {
          setIsAllowedToVoteCheck(true); // No specific voter list, so any authenticated user can vote (if logged in)
        }
        // Check if already voted
        const votedStatus = await checkIfUserVoted(mockCurrentUser.id, electionId);
        setHasVotedInThisElection(votedStatus);
        if (votedStatus) {
          // If already voted, try to re-fetch/display badge if one was made (not implemented for persistence here)
          // For now, just set a generic message or try to generate if not present
           if (!participationBadgeUrl) { // Simple check, could be more robust
            setParticipationBadgeUrl(localStorage.getItem(`badge-${electionId}-${mockCurrentUser.id}`));
            setBadgeMessage(localStorage.getItem(`badgeMsg-${electionId}-${mockCurrentUser.id}`));
          }
        }

      } else {
        setIsAllowedToVoteCheck(false); // Not authenticated
        setHasVotedInThisElection(false);
      }
    } else {
      toast({ title: "Error", description: "Election not found.", variant: "destructive" });
      router.push('/voting');
    }
  }, [electionId, router, toast, participationBadgeUrl]);

  useEffect(() => {
    fetchElectionData();
  }, [fetchElectionData]);

 useEffect(() => {
    if (electionId) {
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
    }
  }, [electionId, toast]);


  if (!election || isAllowedToVoteCheck === undefined || hasVotedInThisElection === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
        <Info className="h-8 w-8 mr-2 animate-spin mb-2" /> 
        <p>Loading election details...</p>
      </div>
    );
  }
  
  const isElectionOngoing = election.status === 'ongoing';


  const handleVoteSubmit = async () => {
    if (!selectedCandidate) {
      toast({ title: "No Selection", description: "Please select a candidate to vote.", variant: "destructive" });
      return;
    }
    if (!mockCurrentUser) {
      toast({ title: "Authentication Required", description: "You must be logged in to vote.", variant: "destructive" });
      return;
    }
    if (!isAllowedToVoteCheck) {
       toast({ title: "Voting Restricted", description: "You are not authorized to vote in this election.", variant: "destructive" });
      return;
    }
    if (hasVotedInThisElection) {
      toast({ title: "Already Voted", description: "You have already cast your vote in this election.", variant: "default" });
      return;
    }

    setIsSubmittingVote(true);
    try {
      const result = await recordVote({
        userId: mockCurrentUser.id,
        electionId: election.id,
        candidateId: selectedCandidate,
      });

      if (result.success) {
        setHasVotedInThisElection(true); // Update state immediately
        const candidateName = election.candidates.find(c => c.id === selectedCandidate)?.name || 'your chosen candidate';
        toast({
          title: "Vote Submitted!",
          description: `You successfully voted for ${candidateName}. Thank you for participating! Generating your participation badge...`,
          className: "bg-accent text-accent-foreground border-accent-foreground/20"
        });

        // Generate participation badge
        setIsGeneratingBadge(true);
        const badgeInput: GenerateParticipationBadgeInput = {
          electionTitle: election.title,
          userName: mockCurrentUser.name || "Valued Voter",
        };
        const badgeResult = await generateParticipationBadge(badgeInput);
        setParticipationBadgeUrl(badgeResult.badgeImageUrl);
        setBadgeMessage(badgeResult.message || `Thank you for voting in ${election.title}!`);
        
        // Store badge in local storage for this simple demo (won't persist across sessions robustly)
        localStorage.setItem(`badge-${electionId}-${mockCurrentUser.id}`, badgeResult.badgeImageUrl);
        localStorage.setItem(`badgeMsg-${electionId}-${mockCurrentUser.id}`, badgeResult.message || "");

        setIsGeneratingBadge(false);

      } else {
        toast({ title: "Vote Submission Failed", description: result.error || "An unknown error occurred.", variant: "destructive" });
         if (result.alreadyVoted) {
          setHasVotedInThisElection(true); // Sync state if server says already voted
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred while submitting your vote.", variant: "destructive" });
    } finally {
      setIsSubmittingVote(false);
    }
  };

  const votingContent = (
    <>
      {!isElectionOngoing && !hasVotedInThisElection && (
         <Alert variant="default" className="mb-6">
          <Info className="h-5 w-5" />
          <AlertTitle className="font-semibold">Election Not Active for Voting</AlertTitle>
          <AlertDescription>
            This election is currently {election.status}. Voting is only available for 'ongoing' elections.
          </AlertDescription>
        </Alert>
      )}

      {isElectionOngoing && !hasVotedInThisElection && (
        <>
          <Alert variant="default" className="mb-6 bg-primary/10 border-primary/50">
            <Shield className="h-5 w-5 text-primary" />
            <AlertTitle className="font-semibold text-primary">Your Vote is Secure</AlertTitle>
            <AlertDescription className="text-primary/90">
              All votes are processed with security and anonymity in mind.
            </AlertDescription>
          </Alert>

          {!isAllowedToVoteCheck && mockCurrentUser && (
            <Alert variant="destructive" className="mb-6">
                <Lock className="h-5 w-5" />
                <AlertTitle className="font-semibold">Voting Restricted</AlertTitle>
                <AlertDescription>
                  Your email ({mockCurrentUser.email}) is not on the list of allowed voters for this election.
                </AlertDescription>
              </Alert>
          )}
          {!mockCurrentUser && (
            <Alert variant="destructive" className="mb-6">
                <Lock className="h-5 w-5" />
                <AlertTitle className="font-semibold">Authentication Required</AlertTitle>
                <AlertDescription>
                  You must be logged in to vote. (Currently simulated).
                </AlertDescription>
              </Alert>
          )}

          <h3 className="text-xl font-semibold mb-4">Select Your Choice:</h3>
          <RadioGroup
            value={selectedCandidate || ""}
            onValueChange={setSelectedCandidate}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            disabled={!isAllowedToVoteCheck || !mockCurrentUser || isSubmittingVote}
          >
            {election.candidates.map((candidate: Candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                isSelected={selectedCandidate === candidate.id}
                onSelect={setSelectedCandidate}
                disabled={!isAllowedToVoteCheck || !mockCurrentUser || isSubmittingVote}
              />
            ))}
          </RadioGroup>
          <Button 
            size="lg" 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90" 
            onClick={handleVoteSubmit}
            disabled={!selectedCandidate || isSubmittingVote || !isAllowedToVoteCheck || !mockCurrentUser || !isElectionOngoing}
          >
            {isSubmittingVote ? 'Submitting Vote...' : `Submit Vote for ${election.candidates.find(c => c.id === selectedCandidate)?.name || 'Selected Candidate'}`}
          </Button>
        </>
      )}

      {hasVotedInThisElection && (
        <Card className="mt-6 shadow-md">
          <CardHeader className="items-center text-center bg-accent/10">
            <PartyPopper className="h-12 w-12 text-accent mb-2" />
            <CardTitle className="text-2xl text-accent">Vote Confirmed!</CardTitle>
            <CardDescription>Thank you for participating in {election.title}.</CardDescription>
          </CardHeader>
          <CardContent className="text-center p-6 space-y-4">
            {isGeneratingBadge && (
              <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                <Info className="h-6 w-6 animate-spin" />
                <p>Generating your participation badge...</p>
              </div>
            )}
            {participationBadgeUrl && !isGeneratingBadge && (
              <div className="flex flex-col items-center space-y-3">
                <Image 
                    src={participationBadgeUrl} 
                    alt="Participation Badge" 
                    width={300} 
                    height={200} 
                    className="rounded-md object-contain border shadow-sm"
                    data-ai-hint="participation badge voting sticker" 
                />
                {badgeMessage && <p className="text-sm text-muted-foreground">{badgeMessage}</p>}
              </div>
            )}
             {!participationBadgeUrl && !isGeneratingBadge && (
              <p className="text-sm text-muted-foreground">Your vote has been recorded.</p>
            )}
          </CardContent>
        </Card>
      )}
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
                <Vote className="mr-2 h-5 w-5" /> {hasVotedInThisElection ? "Vote Cast" : "Vote"}
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
