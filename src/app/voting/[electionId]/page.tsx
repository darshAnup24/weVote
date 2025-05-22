"use client";

import { useParams, useRouter } from 'next/navigation';
import { mockElections } from '@/lib/mock-data';
import type { Candidate } from '@/lib/types';
import { CandidateCard } from '@/components/voting/candidate-card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, ArrowLeft, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ElectionVotingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const electionId = params.electionId as string;
  
  const [election, setElection] = useState<typeof mockElections[0] | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const foundElection = mockElections.find(e => e.id === electionId);
    if (foundElection) {
      setElection(foundElection);
    } else {
      // Handle election not found, perhaps redirect or show error
      toast({ title: "Error", description: "Election not found.", variant: "destructive" });
      router.push('/voting');
    }
  }, [electionId, router, toast]);

  if (!election) {
    return (
      <div className="flex items-center justify-center h-full">
        <Info className="h-8 w-8 mr-2 animate-spin" /> Loading election details...
      </div>
    );
  }

  if (election.status !== 'ongoing') {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.push('/voting')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Elections
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
    setIsSubmitting(true);
    // Simulate API call for vote submission
    setTimeout(() => {
      toast({
        title: "Vote Submitted!",
        description: `You successfully voted for ${election.candidates.find(c => c.id === selectedCandidate)?.name}. Thank you for participating!`,
        className: "bg-accent text-accent-foreground border-accent-foreground/20"
      });
      setIsSubmitting(false);
      router.push('/voting'); // Redirect after voting
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Button variant="outline" asChild>
        <Link href="/voting">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Elections
        </Link>
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">{election.title}</CardTitle>
          <CardDescription className="text-lg">{election.description}</CardDescription>
        </CardHeader>
        <CardContent>
           <Alert variant="default" className="mb-6 bg-primary/10 border-primary/50">
            <Shield className="h-5 w-5 text-primary" />
            <AlertTitle className="font-semibold text-primary">Your Vote is Secure</AlertTitle>
            <AlertDescription className="text-primary/90">
              All votes are processed with security and anonymity in mind. Real end-to-end encryption would be implemented in a production system.
            </AlertDescription>
          </Alert>

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
            disabled={!selectedCandidate || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : `Submit Vote for ${election.candidates.find(c => c.id === selectedCandidate)?.name || ''}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
