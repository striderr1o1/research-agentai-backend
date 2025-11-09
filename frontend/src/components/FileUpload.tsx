import { useCallback } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

export const FileUpload = ({ files, setFiles }: FileUploadProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "application/pdf"
      );
      
      if (droppedFiles.length === 0) {
        toast.error("Please upload only PDF files");
        return;
      }

      setFiles([...files, ...droppedFiles]);
      toast.success(`${droppedFiles.length} file(s) added`);
    },
    [files, setFiles]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type === "application/pdf"
      );
      
      if (selectedFiles.length === 0) {
        toast.error("Please upload only PDF files");
        return;
      }

      setFiles([...files, ...selectedFiles]);
      toast.success(`${selectedFiles.length} file(s) added`);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    toast.info("File removed");
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
      <h2 className="text-xl font-semibold text-card-foreground mb-4">Upload Documents</h2>
      
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-all hover:border-primary hover:bg-primary/5 cursor-pointer group"
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf"
          onChange={handleFileInput}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <p className="text-base font-medium text-foreground mb-1">
            Drop PDFs here or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Support for multiple PDF files
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Uploaded files ({files.length})
          </p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-secondary/50 rounded-lg p-3 group hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
