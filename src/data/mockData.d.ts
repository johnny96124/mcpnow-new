export type EndpointType = 'HTTP_SSE' | 'STDIO' | 'WS';

export interface ServerTool {
  id: string;
  name: string;
  description: string;
  icon?: React.ComponentType<any>;
  link: string;
}

export interface ServerDefinition {
  id: string;
  name: string;
  description: string;
  type: EndpointType;
  multipleTypes?: EndpointType[]; // Added multipleTypes support
  version?: string;
  repository?: string;
  author?: string;
  categories?: string[];
  features?: string[];
  isOfficial?: boolean;
  tools?: ServerTool[];
  downloads?: number;
}

export interface ServerInstance {
  id: string;
  name: string;
  definitionId: string;
  status: 'running' | 'stopped' | 'error' | 'connecting';
  connectionDetails: string;
  enabled: boolean;
  arguments?: string[];
  environment?: Record<string, string>;
}

export type ConnectionStatus = "connected" | "disconnected" | "connecting";

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
  port: number;
  connectionStatus: ConnectionStatus;
  serverInstances: ServerInstance[];
}

export const serverDefinitions: ServerDefinition[];
export const discoveryItems: ServerDefinition[];
