
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelected: (emoji: string) => void;
  className?: string;
}

const emojiCategories = [
  {
    name: "Hand Gestures",
    emojis: [
      "👋", "✋", "🖐️", "👌", "✌️", "🤞", "🤘", "🤙", "👍", "👎", 
      "👊", "✊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏"
    ]
  },
  {
    name: "Technology",
    emojis: [
      "💻", "🖥️", "🖱️", "⌨️", "🖨️", "📱", "☎️", "📞", "📟", "📠",
      "🔋", "🔌", "💾", "💿", "📀", "🧮", "🎥", "🎬", "📺", "📷"
    ]
  },
  {
    name: "Places",
    emojis: [
      "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪",
      "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽", "⛪", "🕌"
    ]
  },
  {
    name: "Objects",
    emojis: [
      "🔧", "🔨", "⛏️", "🪓", "🔩", "🧰", "🗄️", "📁", "📂", "🗂️",
      "📅", "📆", "📇", "📈", "📉", "📊", "📌", "📍", "📎", "🖇️"
    ]
  },
  {
    name: "Symbols",
    emojis: [
      "☁️", "⭐", "🌟", "🌐", "🔮", "🔍", "🔎", "🔑", "🔒", "🔓",
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "💔", "❣️", "💕"
    ]
  }
];

export function EmojiPicker({ selectedEmoji, onEmojiSelected, className }: EmojiPickerProps) {
  return (
    <Popover>
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
      <PopoverContent className="w-64 p-0" align="start">
        <ScrollArea className="h-72 rounded-md border">
          <div className="p-4">
            {emojiCategories.map((category) => (
              <div key={category.name} className="mb-4">
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">{category.name}</h4>
                <div className="grid grid-cols-8 gap-2">
                  {category.emojis.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      className={cn(
                        "h-8 w-8 p-0 hover:bg-muted cursor-pointer",
                        selectedEmoji === emoji && "bg-muted"
                      )}
                      onClick={() => onEmojiSelected(emoji)}
                    >
                      <span className="text-lg">{emoji}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
