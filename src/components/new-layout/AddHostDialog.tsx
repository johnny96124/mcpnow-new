
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Computer, Server } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

const hostSchema = z.object({
  name: z.string().min(1, { message: "Host name is required" }),
  icon: z.string().optional(),
  configPath: z.string().optional(),
  configOption: z.enum(["withPath", "withoutPath"])
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
  const [configOption, setConfigOption] = useState<"withPath" | "withoutPath">("withPath");
  
  const form = useForm<HostFormValues>({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      name: "",
      icon: "💻",
      configPath: "",
      configOption: "withPath"
    },
  });

  // Sample config in JSON format for display
  const sampleConfig = {
    mcpServers: {
      mcpnow: {
        command: "npx",
        args: [
          "-y",
          "@modelcontextprotocol/mcpnow",
          "http://localhost:8008/mcp"
        ]
      }
    }
  };

  const handleSubmit = (values: HostFormValues) => {
    const newHost: Host = {
      id: `host-${Date.now()}`,
      name: values.name,
      icon: selectedEmoji,
      configPath: values.configOption === "withPath" ? values.configPath : undefined,
      connectionStatus: values.configOption === "withPath" ? "connected" : "connected",
      configStatus: values.configOption === "withPath" ? "configured" : "unknown",
    };

    onAddHost(newHost);
    form.reset();
    setSelectedEmoji("💻");
    setConfigOption("withPath");
    onOpenChange(false);
  };

  const copyConfigToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleConfig, null, 2));
    toast({
      title: "Configuration copied",
      description: "Configuration has been copied to clipboard"
    });
  };

  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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

            <FormField
              control={form.control}
              name="configOption"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Configuration Method</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setConfigOption(value as "withPath" | "withoutPath");
                      }}
                      value={field.value} 
                      className="flex flex-col gap-3"
                    >
                      <div className={cn(
                        "flex items-center space-x-3 rounded-md border p-4 cursor-pointer",
                        configOption === "withPath" ? "border-primary bg-primary/5" : "border-muted"
                      )}>
                        <RadioGroupItem value="withPath" id="withPath" />
                        <Label htmlFor="withPath" className="cursor-pointer flex-1">
                          <div className="font-medium mb-1 flex items-center">
                            <Server className="h-4 w-4 mr-2" />
                            Specify Config Path
                          </div>
                          <p className="text-sm text-muted-foreground">
                            I'll provide the path to my configuration file
                          </p>
                        </Label>
                      </div>
                      
                      <div className={cn(
                        "flex items-center space-x-3 rounded-md border p-4 cursor-pointer",
                        configOption === "withoutPath" ? "border-primary bg-primary/5" : "border-muted"
                      )}>
                        <RadioGroupItem value="withoutPath" id="withoutPath" />
                        <Label htmlFor="withoutPath" className="cursor-pointer flex-1">
                          <div className="font-medium mb-1 flex items-center">
                            <Computer className="h-4 w-4 mr-2" />
                            Manual Configuration
                          </div>
                          <p className="text-sm text-muted-foreground">
                            I'll manually set up the configuration on my host
                          </p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {configOption === "withPath" ? (
              <FormField
                control={form.control}
                name="configPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Config Path</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/path/to/config.json" />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Path must start with / and end with .json
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="space-y-2">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    Please copy this configuration and manually add it to your host's configuration file.
                  </AlertDescription>
                </Alert>
                
                <div className="relative">
                  <ScrollArea className="h-[120px] w-full rounded-md border p-4">
                    <pre className="text-xs font-mono">
                      {JSON.stringify(sampleConfig, null, 2)}
                    </pre>
                  </ScrollArea>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyConfigToClipboard} 
                    className="absolute top-2 right-2"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Confirm & Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
