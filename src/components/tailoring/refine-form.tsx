import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { useRefineTailoring } from "@/hooks/api/use-tailoring";
import { Textarea } from "../ui/textarea";

interface RefineFormProps {
  sessionId: string;
  onRefined: (content: {
    cv: import("@/types").TailoredCV;
    coverLetter: import("@/types").CoverLetter;
  }) => void;
}

export function RefineForm({ sessionId, onRefined }: RefineFormProps) {
  const [feedback, setFeedback] = useState("");
  const refine = useRefineTailoring();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    refine.mutate(
      { sessionId, feedback: feedback.trim() },
      {
        onSuccess: (data) => {
          onRefined(data.content);
          setFeedback("");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Label htmlFor="feedback" className="text-sm font-medium">
        Refinement Feedback
      </Label>
      <Textarea
        id="feedback"
        placeholder="e.g. Make the summary more senior-level, add Kubernetes to skills, emphasize the fintech experience..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={3}
        disabled={refine.isPending}
      />
      <Button
        type="submit"
        variant="outline"
        className="gap-2 border-[#3c6e71] text-[#3c6e71] hover:bg-[#3c6e71]/10"
        disabled={refine.isPending || !feedback.trim()}
      >
        {refine.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {refine.isPending ? "Refining..." : "Refine with AI"}
      </Button>
    </form>
  );
}