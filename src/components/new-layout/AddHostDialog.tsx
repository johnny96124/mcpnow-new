
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Host } from "@/data/mockData";
import { EmojiPicker } from "../hosts/EmojiPicker";

const hostSchema = z.object({
  name: z.string().min(1, { message: "Host name is required" }),
  icon: z.string().optional(),
});

type HostFormValues = z.infer<typeof hostSchema>;

interface AddHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHost: (host: Host) => void;
}

export function AddHostDialog({
  open,
  onOpenChange,
  onAddHost,
}: AddHostDialogProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("💻");
  
  const form = useForm<HostFormValues>({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      name: "",
      icon: "💻",
    },
  });

  const handleSubmit = (values: HostFormValues) => {
    const newHost: Host = {
      id: `host-${Date.now()}`,
      name: values.name,
      icon: selectedEmoji,
      connectionStatus: "disconnected",
      configStatus: "unknown",
    };

    onAddHost(newHost);
    form.reset();
    setSelectedEmoji("💻");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Host</DialogTitle>
          <DialogDescription>
            Add a new host to connect servers to
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter host name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host Icon</FormLabel>
                  <FormControl>
                    <EmojiPicker
                      selectedEmoji={selectedEmoji}
                      onEmojiSelected={(emoji) => {
                        setSelectedEmoji(emoji);
                        field.onChange(emoji);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Add Host</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
