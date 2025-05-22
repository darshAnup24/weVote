
import type { Candidate } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group"; 
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (candidateId: string) => void;
  disabled?: boolean;
}

export function CandidateCard({ candidate, isSelected, onSelect, disabled = false }: CandidateCardProps) {
  const handleSelect = () => {
    if (!disabled) {
      onSelect(candidate.id);
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 ease-in-out shadow-md",
        disabled ? "opacity-60 cursor-not-allowed bg-muted/50" : "cursor-pointer hover:shadow-lg",
        isSelected && !disabled ? "ring-2 ring-primary border-primary bg-primary/5" : "border-border"
      )}
      onClick={handleSelect}
      onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) handleSelect(); }}
      role="radio"
      aria-checked={isSelected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
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
        <RadioGroupItem 
            value={candidate.id} 
            checked={isSelected} 
            aria-label={`Select ${candidate.name}`} 
            id={`candidate-radio-${candidate.id}`}
            disabled={disabled}
        />
      </CardHeader>
    </Card>
  );
}
