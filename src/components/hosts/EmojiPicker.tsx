
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelected: (emoji: string) => void;
  className?: string;
}

const emojiCategories = [
  {
    name: "Smileys & Emotion",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊",
      "😇", "🥰", "😍", "🤩", "😘", "😗", "☺️", "😚", "😙", "🥲", "😋", "😛",
      "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑",
      "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷",
      "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳"
    ]
  },
  {
    name: "People & Body",
    emojis: [
      "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", 
      "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", 
      "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", 
      "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", 
      "👁️", "👅", "👄", "💋"
    ]
  },
  {
    name: "Animals & Nature",
    emojis: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", 
      "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", 
      "🐺", "🐗", "🐴", "🦄", "🐝", "🪱", "🐛", "🦋", "🐌", "🐞", "🐜", "🪰", 
      "🪲", "🪳", "🦟", "🦗", "🕷️", "🕸️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", 
      "🐙", "🦑", "🦐", "🦞", "🦀", "🐠", "🐟", "🐡", "🐬", "🦈", "🐳", "🐋"
    ]
  },
  {
    name: "Food & Drink",
    emojis: [
      "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", 
      "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", 
      "🫑", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", 
      "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", 
      "🍔", "🍟", "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔"
    ]
  },
  {
    name: "Travel & Places",
    emojis: [
      "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", 
      "🏭", "🏯", "🏰", "💒", "🗼", "🗽", "⛪", "🕌", "🛕", "🕍", "⛩️", "🕋", 
      "⛲", "⛺", "🌁", "🌃", "🏙️", "🌄", "🌅", "🌆", "🌇", "🌉", "♨️", "🎠", 
      "🎡", "🎢", "💈", "🎪", "🚂", "🚃", "🚄", "🚅", "🚆", "🚇", "🚈", "🚉", 
      "🚊", "🚝", "🚞", "🚋", "🚌", "🚍", "🚎", "🚐", "🚑", "🚒", "🚓", "🚔"
    ]
  },
  {
    name: "Activities",
    emojis: [
      "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷", "🎺", "🎸", "🎻", 
      "🎲", "♟️", "🎯", "🎳", "🎮", "🎰", "🧩", "🚗", "🚕", "🚙", "🚌", "🚎", 
      "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🦯", "🦽", "🦼", 
      "🛴", "🚲", "🛵", "🏍️", "🛺", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", 
      "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊"
    ]
  },
  {
    name: "Objects",
    emojis: [
      "⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", 
      "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽️", "🎞️", "📞", "☎️", 
      "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", 
      "⌛", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", 
      "💵", "💴", "💶", "💷", "💰", "💳", "💎", "⚖️", "🪜", "🧰", "🪛", "🔧", "🔨"
    ]
  },
  {
    name: "Symbols",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", 
      "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", 
      "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊", "♋", "♌", "♍", 
      "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚛️", "🉑", "☢️", "☣️", "📴", "📳", 
      "🈶", "🈚", "🈸", "🈺", "🈷️", "✴️", "🆚", "💮", "🉐", "㊙️", "㊗️", "🈴"
    ]
  },
  {
    name: "Flags",
    emojis: [
      "🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇦🇫", "🇦🇽", "🇦🇱", 
      "🇩🇿", "🇦🇸", "🇦🇩", "🇦🇴", "🇦🇮", "🇦🇶", "🇦🇬", "🇦🇷", "🇦🇲", "🇦🇼", 
      "🇦🇺", "🇦🇹", "🇦🇿", "🇧🇸", "🇧🇭", "🇧🇩", "🇧🇧", "🇧🇾", "🇧🇪", "🇧🇿", 
      "🇧🇯", "🇧🇲", "🇧🇹", "🇧🇴", "🇧🇦", "🇧🇼", "🇧🇷", "🇮🇴", "🇻🇬", "🇧🇳"
    ]
  }
];

export function EmojiPicker({ selectedEmoji, onEmojiSelected, className }: EmojiPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelected(emoji);
    setOpen(false);
  };

  const filteredCategories = searchTerm 
    ? emojiCategories.map(category => ({
        name: category.name,
        emojis: category.emojis.filter(emoji => 
          emoji.includes(searchTerm) || 
          category.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.emojis.length > 0)
    : emojiCategories;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("w-full flex items-center justify-between text-left font-normal", className)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedEmoji}</span>
            <span>Select emoji</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-2 border-b">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search emoji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 border-none focus-visible:ring-transparent"
            />
          </div>
        </div>
        <ScrollArea className="h-80 max-h-[60vh] rounded-md">
          <div className="p-4">
            {filteredCategories.map((category) => (
              <div key={category.name} className="mb-4">
                {category.emojis.length > 0 && (
                  <>
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
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          <span className="text-lg">{emoji}</span>
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
