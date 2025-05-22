
// This page is no longer used as discussions are now per-election.
// It can be removed or repurposed if a global discussion overview is ever needed.
// For now, returning a simple placeholder or redirecting.

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Link from "next/link";

export default function DiscussionsOverviewPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto text-center">
       <Alert variant="default" className="bg-secondary text-secondary-foreground shadow text-left">
        <Info className="h-5 w-5" />
        <AlertTitle className="font-semibold">Discussions Moved</AlertTitle>
        <AlertDescription>
          Anonymous discussions are now specific to each election. You can find them under the &quot;Discussion&quot; tab on any ongoing election&apos;s page.
        </AlertDescription>
      </Alert>
      <p className="text-lg text-muted-foreground">
        Looking for election discussions?
      </p>
      <Button asChild size="lg">
        <Link href="/voting">
          View Elections
        </Link>
      </Button>
    </div>
  );
}
