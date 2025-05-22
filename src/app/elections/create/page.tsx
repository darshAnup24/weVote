import { CreateElectionForm } from "@/components/elections/create-election-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function CreateElectionPage() {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-5 w-5" />
        <AlertTitle className="font-semibold">Create New Election</AlertTitle>
        <AlertDescription>
          Fill out the details below to set up a new election. Specify candidates, voting period, and optionally, a list of emails for eligible voters.
          <br/>
          <strong className="text-primary">Note:</strong> User authentication is currently simulated. In a real application, robust authentication would be implemented.
        </AlertDescription>
      </Alert>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Election Setup Form</CardTitle>
          <CardDescription>Provide all necessary information for your new election.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateElectionForm />
        </CardContent>
      </Card>
    </div>
  );
}
