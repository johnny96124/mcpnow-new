
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Import } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/data/mockData";

interface ImportProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: (profile: Profile) => void;
}

export function ImportProfileDialog({
  open,
  onOpenChange,
  onImportSuccess
}: ImportProfileDialogProps) {
  const [shareLink, setShareLink] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<"success" | "error" | null>(null);
  const [importedProfile, setImportedProfile] = useState<Profile | null>(null);
  const { toast } = useToast();
  
  const resetDialog = () => {
    setShareLink("");
    setImportResult(null);
    setImportedProfile(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    onOpenChange(open);
  };
  
  const handleImport = () => {
    if (!shareLink.trim()) {
      toast({
        title: "Error",
        description: "Please enter a share link",
        type: "error"
      });
      return;
    }
    
    setIsImporting(true);
    
    // Simulate import process with a timeout
    setTimeout(() => {
      // Mock verification logic - check if link has correct format
      const isValid = shareLink.includes("sh.io/");
      
      if (isValid) {
        // Mock imported profile data
        const mockProfileData: Profile = {
          id: `imported-profile-${Date.now()}`,
          name: "Imported Profile",
          endpoint: "http://localhost:8008/mcp",
          endpointType: "HTTP_SSE",
          enabled: true,
          instances: ["server-1", "server-2"]
        };
        
        setImportedProfile(mockProfileData);
        setImportResult("success");
        
        // Notify parent component of successful import
        onImportSuccess(mockProfileData);
        
        toast({
          title: "Import successful",
          description: "Profile has been imported successfully",
          type: "success"
        });
      } else {
        setImportResult("error");
        
        toast({
          title: "Import failed",
          description: "The share link is invalid or expired",
          type: "error"
        });
      }
      
      setIsImporting(false);
    }, 1500);
  };
  
  const handleDone = () => {
    handleOpenChange(false);
  };
  
  const handleRetry = () => {
    setShareLink("");
    setImportResult(null);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Import className="h-5 w-5" />
            Import Profile
          </DialogTitle>
          <DialogDescription>
            Import a profile that was shared with you
          </DialogDescription>
        </DialogHeader>
        
        {importResult === null ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Enter the share link to import a profile
              </p>
              <Input
                placeholder="e.g., sh.io/abc123"
                value={shareLink}
                onChange={(e) => setShareLink(e.target.value)}
                className="font-mono"
              />
            </div>
            <DialogFooter>
              <Button 
                onClick={handleImport}
                disabled={isImporting}
                className="w-full"
              >
                {isImporting ? "Importing..." : "Import Profile"}
              </Button>
            </DialogFooter>
          </div>
        ) : importResult === "success" ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Import Successful</h3>
              <p className="text-sm text-muted-foreground">
                {importedProfile?.name} has been added to your profiles
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleDone} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <X className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Import Failed</h3>
              <p className="text-sm text-muted-foreground">
                The share link is invalid or has expired
              </p>
            </div>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={handleRetry} className="w-full">
                Try Again
              </Button>
              <Button onClick={handleDone} className="w-full" variant="ghost">
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
