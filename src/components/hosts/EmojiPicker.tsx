
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelected: (emoji: string) => void;
  className?: string;
}

// List of object icons from the provided image
const objectIcons = [
  // Row 1
  "⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🪬", "🔴", "🔍", "💿", "💾", "📀", "📼", "📷", "📸", "📹", "🎥", "📽️", 
  "🎞️", "📞", "☎️",
  
  // Row 2
  "📺", "📻", "🎙️", "📒", "🎚️", "⏰", "⏱️", "⏲️", "🕰️", "🕓", "🏺", "🏆", "📡", "🔋", "🪫", "🔌", "💡", "🔦", "🕯️", "🪔", 
  "🧯", "🛢️",
  
  // Row 3
  "💸", "💵", "💴", "💶", "💷", "💰", "💳", "💎", "⚖️", "🪜", "🧰", "⛏️", "🔧", "🔨", "🪓", "⚒️", "🛠️", "🗡️", "⚔️", "🔫", "🪃", "🏹",
  
  // Row 4
  "🧨", "🪓", "🔪", "🗡️", "⚔️", "🛡️", "🚬", "⚰️", "🪦", "⚱️", "🏺", "💊", "💉", "🩸", "🩹", "🩺", "🚪", "🪞", "🪟", "🛏️",
  
  // Row 5
  "🛋️", "🪑", "🚽", "🪠", "🚿", "🛁", "🪤", "🧴", "🧷", "🧹", "🧺", "🧻", "🪣", "🧼", "🫧", "🪥", "🧽", "🧯", "🛒",
  
  // Row 6
  "🚬", "📭", "📬", "📪", "📫", "📮", "🪧", "📜", "📃", "📄", "📑", "📊", "📈", "📉", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐",
  
  // Row 7
  "🧮", "📌", "📍", "✂️", "✒️", "✏️", "🖋️", "🖊️", "🖌️", "🖍️", "📝", "🔍", "🔎", "🔏", "🔐", "🔒", "🔓"
];

export function EmojiPicker({ selectedEmoji, onEmojiSelected, className }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelected(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("w-full flex items-center justify-between text-left font-normal", className)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedEmoji}</span>
            <span>Select icon</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <ScrollArea className="h-80 max-h-[60vh] rounded-md">
          <div className="p-4">
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">Objects</h4>
            <div className="grid grid-cols-8 gap-2">
              {objectIcons.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  className={cn(
                    "h-8 w-8 p-0 hover:bg-muted cursor-pointer",
                    selectedEmoji === emoji && "bg-muted"
                  )}
                  onClick={() => handleEmojiClick(emoji)}
                >
                  <span className="text-lg">{emoji}</span>
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
