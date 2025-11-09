import { Card } from "@/components/ui/card";
import { Loader2, FileText, ExternalLink, CheckCircle2, Brain, Search, FileSearch, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface AgentUpdate {
  agent: string;
  output: any;
}

interface ResultsDisplayProps {
  agentUpdates: AgentUpdate[];
  isLoading: boolean;
}

const agentIcons = {
  planner: Brain,
  extractor: FileSearch,
  searcher: Search,
  summarizer: FileText,
};

export const ResultsDisplay = ({ agentUpdates, isLoading }: ResultsDisplayProps) => {
  const finalResult = agentUpdates.find(u => u.agent === "summarizer")?.output || "";
  const [expandedAgents, setExpandedAgents] = useState<string[]>([]);
  
  const toggleAgent = (agent: string) => {
    setExpandedAgents(prev => 
      prev.includes(agent) ? prev.filter(a => a !== agent) : [...prev, agent]
    );
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalResult);
  };
  
  const formatAgentOutput = (output: any) => {
    if (typeof output === 'string') {
      return output;
    }
    return JSON.stringify(output, null, 2);
  };

  const formatResult = (text: string) => {
    // Simple markdown-like formatting
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl font-bold text-foreground mt-6 mb-3">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-semibold text-foreground mt-5 mb-2">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-medium text-foreground mt-4 mb-2">{line.substring(4)}</h3>;
      }
      
      // Bold text
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={i} className="text-foreground mb-2 leading-relaxed">
            {parts.map((part, j) => j % 2 === 0 ? part : <strong key={j} className="font-semibold">{part}</strong>)}
          </p>
        );
      }
      
      // Links - simple pattern matching for URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      if (urlRegex.test(line)) {
        const parts = line.split(urlRegex);
        return (
          <p key={i} className="text-foreground mb-2 leading-relaxed">
            {parts.map((part, j) => 
              urlRegex.test(part) ? (
                <a 
                  key={j} 
                  href={part} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  {part}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : part
            )}
          </p>
        );
      }
      
      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={i} className="text-foreground ml-4 mb-1 leading-relaxed">
            {line.trim().substring(2)}
          </li>
        );
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      
      // Regular paragraphs
      return <p key={i} className="text-foreground mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <Card className="p-6 border-border shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-card-foreground">Research Results</h2>
        </div>
        {finalResult && (
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="hover:bg-primary/10 hover:text-primary transition-colors"
          >
            Copy
          </Button>
        )}
      </div>

      {/* Agent Progress & Outputs */}
      {agentUpdates.length > 0 && (
        <div className="space-y-3 mb-6">
          {["planner", "extractor", "searcher", "summarizer"].map((agentName) => {
            const update = agentUpdates.find(u => u.agent === agentName);
            const Icon = agentIcons[agentName as keyof typeof agentIcons];
            const isComplete = !!update;
            const isCurrent = isLoading && !isComplete && agentUpdates[agentUpdates.length - 1]?.agent !== "summarizer";
            const isExpanded = expandedAgents.includes(agentName);
            
            return (
              <div 
                key={agentName} 
                className={`rounded-lg border transition-all ${
                  isComplete 
                    ? "bg-primary/5 border-primary/20" 
                    : isCurrent 
                    ? "bg-muted/50 border-border animate-pulse" 
                    : "bg-muted/20 border-border/50 opacity-50"
                }`}
              >
                <div 
                  className={`flex items-center gap-3 p-3 ${isComplete ? 'cursor-pointer hover:bg-primary/10' : ''}`}
                  onClick={() => isComplete && toggleAgent(agentName)}
                >
                  <div className={`p-2 rounded-full ${isComplete ? "bg-primary/10" : "bg-muted"}`}>
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                    ) : (
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground capitalize">{agentName}</p>
                  </div>
                  {isComplete && (
                    <>
                      <Badge variant="secondary" className="text-xs">Complete</Badge>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </>
                  )}
                </div>
                
                {isComplete && isExpanded && update && (
                  <div className="px-3 pb-3 pt-0">
                    <div className="bg-background/50 rounded-md p-4 border border-border/50">
                      <pre className="text-xs text-foreground whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
                        {formatAgentOutput(update.output)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isLoading && agentUpdates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="text-center">
            <p className="text-lg font-medium text-foreground mb-2">Starting research...</p>
            <p className="text-sm text-muted-foreground">
              Initializing AI agents
            </p>
          </div>
        </div>
      ) : finalResult ? (
        <div className="prose prose-slate max-w-none">
          <div className="bg-gradient-to-br from-secondary/30 to-background rounded-lg p-6 border border-border">
            {formatResult(finalResult)}
          </div>
        </div>
      ) : agentUpdates.length > 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p>Processing agents...</p>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No results yet. Submit a query to get started.</p>
        </div>
      )}
    </Card>
  );
};
