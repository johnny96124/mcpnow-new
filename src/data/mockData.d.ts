
export interface ServerInstance {
  id: string;
  name: string;
  definitionId: string;
  status: "running" | "stopped" | "error";
  connectionDetails: string;
  enabled: boolean;
  url?: string;
  headers?: Record<string, string>;
  arguments?: string[];
  environment?: Record<string, string>;
  description?: string; // Added description field
}

export interface ServerDefinition {
  id: string;
  name: string;
  type: "HTTP_SSE" | "STDIO" | "WS";
  description: string;
  categories?: string[];
  features?: string[];
  isOfficial?: boolean;
  author?: string;
  repository?: string;
  version?: string;
  downloads?: number;
  requirements?: {
    type: 'llm' | 'tool' | 'memory';
    value: string;
  }[];
  versionHistory?: {
    version: string;
    releaseDate: Date | string;
    author: string;
    changes?: string[];
  }[];
}

export interface Profile {
  id: string;
  name: string;
  description: string;
  hosts: Host[];
}

export interface Host {
  id: string;
  name: string;
  address: string;
  servers: ServerInstance[];
}
