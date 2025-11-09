import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const QueryInput = ({ query, setQuery, onSubmit, isLoading }: QueryInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
      <h2 className="text-xl font-semibold text-card-foreground mb-4">Research Query</h2>
      
      <div className="space-y-4">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What would you like to research? E.g., 'Summarize the key findings about neural networks in these papers'"
          className="min-h-[120px] resize-none bg-background border-border focus:border-primary transition-colors"
          disabled={isLoading}
        />
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs">Cmd/Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs">Enter</kbd> to submit
          </p>
          
          <Button
            onClick={onSubmit}
            disabled={isLoading || !query.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Start Research
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
