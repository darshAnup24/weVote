
import type { Election } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarDays, Users, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ElectionCardProps {
  election: Election;
}

export function ElectionCard({ election }: ElectionCardProps) {
  const { title, description, status, startDate, endDate, id, imageUrl, dataAiHint } = election;

  const formattedStartDate = startDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedEndDate = endDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  let statusBadgeVariant: "default" | "secondary" | "outline" | "destructive" = "secondary";
  let statusIcon = <Clock className="mr-2 h-4 w-4" />;
  if (status === "ongoing") {
    statusBadgeVariant = "default";
    statusIcon = <Users className="mr-2 h-4 w-4" />;
  } else if (status === "completed") {
    statusBadgeVariant = "outline";
    statusIcon = <CheckCircle className="mr-2 h-4 w-4" />;
  }


  return (
    <Card className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <Image 
            src={imageUrl || `https://placehold.co/600x300.png?text=${encodeURIComponent(title)}`}
            alt={title}
            width={600}
            height={300}
            className="rounded-t-lg object-cover mb-4 aspect-[2/1]"
            data-ai-hint={dataAiHint || "election ballot"}
        />
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <Badge variant={statusBadgeVariant} className="w-fit mt-1">
          {statusIcon}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        <CardDescription className="mt-2 text-sm text-muted-foreground min-h-[3rem]">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="flex items-center text-muted-foreground mb-1">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>Start: {formattedStartDate}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>End: {formattedEndDate}</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        {status === "ongoing" && (
          <Link href={`/voting/${id}`} passHref legacyBehavior>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Vote / Discuss
            </Button>
          </Link>
        )}
         {status === "upcoming" && (
           <Link href={`/voting/${id}`} passHref legacyBehavior>
            <Button variant="outline" className="w-full">
                View Details & Discussion
            </Button>
           </Link>
        )}
        {status === "completed" && (
           <Link href={`/voting/${id}`} passHref legacyBehavior>
            <Button variant="outline" className="w-full">
                View Results & Discussion
            </Button>
           </Link>
        )}
      </CardFooter>
    </Card>
  );
}
