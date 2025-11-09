import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { QueryInput } from "@/components/QueryInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { FileText, Sparkles } from "lucide-react";

interface AgentUpdate {
  agent: string;
  output: any;
}

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [query, setQuery] = useState("");
  const [agentUpdates, setAgentUpdates] = useState<AgentUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast.error("Please enter a research query");
      return;
    }

    setIsLoading(true);
    setAgentUpdates([]);

    try {
      const formData = new FormData();
      formData.append("query", query);
      
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("http://127.0.0.1:8000/run-streaming", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              setAgentUpdates((prev) => [...prev, data]);
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }

      toast.success("Research completed successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Research Agent</h1>
                <p className="text-sm text-muted-foreground">AI-powered document analysis & research</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Upload & Query */}
          <div className="space-y-6 animate-fade-in">
            <FileUpload files={files} setFiles={setFiles} />
            <QueryInput 
              query={query} 
              setQuery={setQuery} 
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Info/Stats */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">How it works</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">Upload PDFs</p>
                    <p className="text-sm text-muted-foreground">Add research papers, documents, or reports</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">Enter Query</p>
                    <p className="text-sm text-muted-foreground">Ask specific questions about your research</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">Get Insights</p>
                    <p className="text-sm text-muted-foreground">AI analyzes and synthesizes information</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            {(files.length > 0 || query) && (
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-6 animate-slide-up">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Current Session</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{files.length}</p>
                      <p className="text-xs text-muted-foreground">PDFs uploaded</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{query ? "1" : "0"}</p>
                      <p className="text-xs text-muted-foreground">Query ready</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {(agentUpdates.length > 0 || isLoading) && (
          <div className="animate-slide-up">
            <ResultsDisplay agentUpdates={agentUpdates} isLoading={isLoading} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
