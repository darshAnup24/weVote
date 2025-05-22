
import type { Candidate } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group"; // RadioGroup itself is not needed if Card is clickable
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (candidateId: string) => void;
}

export function CandidateCard({ candidate, isSelected, onSelect }: CandidateCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:shadow-lg",
        isSelected ? "ring-2 ring-primary border-primary bg-primary/5" : "border-border"
      )}
      onClick={() => onSelect(candidate.id)}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(candidate.id); }}
    >
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        {candidate.imageUrl && (
          <Image 
            src={candidate.imageUrl} 
            alt={candidate.name} 
            width={80} 
            height={80} 
            className="rounded-md object-cover aspect-square"
            data-ai-hint={candidate.dataAiHint || "person portrait"}
          />
        )}
        <div className="flex-1">
          <CardTitle className="text-lg font-medium">{candidate.name}</CardTitle>
          <CardDescription className="text-xs mt-1">{candidate.description}</CardDescription>
        </div>
        {/* The RadioGroupItem provides a visual cue and accessibility for the selection state */}
        <RadioGroupItem value={candidate.id} checked={isSelected} aria-label={`Select ${candidate.name}`} id={`candidate-radio-${candidate.id}`} />
      </CardHeader>
    </Card>
  );
}
