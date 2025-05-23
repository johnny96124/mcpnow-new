import { useState } from "react";
import { Book, ExternalLink, Youtube, HelpCircle, MessageSquare, Twitter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";

interface HelpDialogProps {
  trigger?: React.ReactNode;
}

export function HelpDialog({ trigger }: HelpDialogProps) {
  const [open, setOpen] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="ghost" size="icon" className="rounded-full">
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Help & Resources</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left" asChild>
                <a href="https://docs.mcpnow.org" target="_blank" rel="noopener noreferrer">
                  <Book className="mr-2 h-4 w-4" />
                  Documentation
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left" 
                onClick={() => {
                  setOpen(false);
                  setShowFeedbackDialog(true);
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Feedback
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" asChild>
                <a href="https://mcpnow.org/privacy" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Terms & privacy
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" asChild>
                <a href="https://mcpnow.org/status" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Status
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <FeedbackDialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog} />
    </>
  );
}
