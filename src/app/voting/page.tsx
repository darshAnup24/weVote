import { mockElections } from "@/lib/mock-data";
import type { Election } from "@/lib/types";
import { ElectionCard } from "@/components/voting/election-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function VotingPage() {
  const ongoingElections = mockElections.filter(e => e.status === 'ongoing');
  const upcomingElections = mockElections.filter(e => e.status === 'upcoming');
  const completedElections = mockElections.filter(e => e.status === 'completed');

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-primary/10 border-primary/50 text-primary-foreground shadow-md">
        <Shield className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary">Secure & Anonymous Voting</AlertTitle>
        <AlertDescription className="text-primary/90">
          Your vote is important and private. VoteWise is designed with the principle of end-to-end encryption to ensure your vote is cast securely, stored anonymously, and accurately tallied. 
          <span className="block mt-1 text-sm">(Note: The full cryptographic implementation for end-to-end encryption is a complex process requiring specialized backend infrastructure and is conceptual in this demonstration.)</span>
        </AlertDescription>
      </Alert>

      {ongoingElections.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Ongoing Elections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingElections.map((election: Election) => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        </section>
      )}

      {upcomingElections.length > 0 && (
        <section>
          <Separator className="my-8" />
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Upcoming Elections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingElections.map((election: Election) => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        </section>
      )}
      
      {ongoingElections.length === 0 && upcomingElections.length === 0 && (
         <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-3 text-center h-40">
              <Info className="h-12 w-12 text-muted-foreground" />
              <p className="text-xl font-medium text-muted-foreground">No Active Elections</p>
              <p className="text-sm text-muted-foreground">There are no ongoing or upcoming elections at this moment. Please check back later.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {completedElections.length > 0 && (
        <section>
          <Separator className="my-8" />
          <h2 className="text-2xl font-semibold mb-4 text-muted-foreground">Completed Elections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedElections.map((election: Election) => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
