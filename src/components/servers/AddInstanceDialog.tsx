
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Info, X, Plus, Trash } from "lucide-react";
import { ServerDefinition } from "@/data/mockData";

export interface InstanceFormValues {
  name: string;
  url: string;
  args: string;
  description?: string;
  env?: Record<string, string>;
  headers?: Record<string, string>;
  instanceId?: string;
}

interface AddInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverDefinition: ServerDefinition | null;
  onCreateInstance: (data: InstanceFormValues, selectedHosts?: string[]) => void;
  initialValues?: InstanceFormValues;
  editMode?: boolean;
  instanceId?: string;
  availableHosts?: any[];
}

export const AddInstanceDialog: React.FC<AddInstanceDialogProps> = ({
  open,
  onOpenChange,
  serverDefinition,
  onCreateInstance,
  initialValues,
  editMode = false,
  instanceId,
  availableHosts
}) => {
  const [formData, setFormData] = useState<InstanceFormValues>({
    name: initialValues?.name || "",
    url: initialValues?.url || "",
    args: initialValues?.args || "",
    description: initialValues?.description || "",
    env: initialValues?.env || {},
    headers: initialValues?.headers || {},
    instanceId: instanceId
  });

  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string }>>(
    Object.entries(initialValues?.env || {}).map(([key, value]) => ({ key, value })) || 
    [{ key: "", value: "" }]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnvVarChange = (index: number, field: 'key' | 'value', value: string) => {
    const newEnvVars = [...envVars];
    newEnvVars[index][field] = value;
    setEnvVars(newEnvVars);
    
    // Update the env object in formData
    const envObject: Record<string, string> = {};
    newEnvVars.forEach(item => {
      if (item.key) {
        envObject[item.key] = item.value;
      }
    });
    setFormData(prev => ({ ...prev, env: envObject }));
  };

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const removeEnvVar = (index: number) => {
    const newEnvVars = [...envVars];
    newEnvVars.splice(index, 1);
    setEnvVars(newEnvVars);
    
    // Update the env object in formData
    const envObject: Record<string, string> = {};
    newEnvVars.forEach(item => {
      if (item.key) {
        envObject[item.key] = item.value;
      }
    });
    setFormData(prev => ({ ...prev, env: envObject }));
  };

  const handleSave = () => {
    if (availableHosts && availableHosts.length > 0) {
      onCreateInstance(formData, []);
    } else {
      onCreateInstance(formData);
    }
  };

  if (!serverDefinition) return null;

  const isStdio = serverDefinition.type === 'STDIO';
  const isCustom = serverDefinition.isOfficial === false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="p-6 pt-4 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{serverDefinition.name}</h2>
                  {isStdio && (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      STDIO
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <DialogClose className="h-6 w-6 rounded-md">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          
          <p className="mt-2 text-gray-500 text-sm">
            {serverDefinition.description}
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="name">Instance Name</Label>
              <span className="text-red-500">*</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="name"
              name="name"
              placeholder="Instance Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          {isStdio ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="args">Command Arguments</Label>
                <span className="text-red-500">*</span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <Textarea
                id="args"
                name="args"
                placeholder="e.g., --host localhost --port 8080"
                value={formData.args}
                onChange={handleInputChange}
                className="min-h-[100px] w-full"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="url">URL</Label>
                <span className="text-red-500">*</span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="url"
                name="url"
                placeholder="http://localhost:8080"
                type="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Label>Environment Variables</Label>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addEnvVar}
                className="h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Variable
              </Button>
            </div>

            <div className="space-y-2">
              {envVars.map((env, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Key"
                    value={env.key}
                    onChange={(e) => handleEnvVarChange(index, 'key', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={env.value}
                    onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEnvVar(index)}
                    className="text-red-500 hover:text-red-700 p-0 h-8 w-8"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Skip
          </Button>
          <Button onClick={handleSave} disabled={!formData.name || (!isStdio && !formData.url) || (isStdio && !formData.args)}>
            {editMode ? "Update" : "Create Instance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
