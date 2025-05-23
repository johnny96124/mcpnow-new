import React from 'react';
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Clock, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ServerEvent, EventCategory, EventType } from "@/types/events";

const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string; border: string }> = {
  Tools: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  Resources: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
  Prompts: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" },
  Ping: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
  Sampling: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
  Roots: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" }
};

const EVENT_TYPE_COLORS: Record<EventType, { bg: string; text: string; border: string }> = {
  request: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  response: { bg: "bg-green-50", text: "text-green-800", border: "border-green-200" },
  error: { bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
  notification: { bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-200" }
};

const SAMPLE_REQUEST = {
  method: "tools/call",
  params: {
    name: "longRunningOperation",
    arguments: {
      duration: 5,
      steps: 10
    },
    _meta: {
      progressToken: 1
    }
  }
};

const SAMPLE_NOTIFICATION: ServerEvent = {
  id: "notification-1",
  timestamp: new Date().toISOString(),
  type: "notification" as EventType,
  category: "Prompts" as EventCategory,
  method: "notification/system",
  content: {
    message: "System is running normally",
    status: "success"
  },
  isError: false,
  params: {},
  profileName: "",
  hostName: "",
  jsonrpc: "2.0"
};

interface ServerEventsListProps {
  events: ServerEvent[];
  instanceName?: string;
}

const formatJsonContent = (content: any): JSX.Element => {
  if (typeof content !== 'object') return <>{JSON.stringify(content, null, 2)}</>;
  
  return (
    <>
      <span className="text-black dark:text-white">{'{'}</span>
      {Object.entries(content).map(([key, value], index) => (
        <div key={key} style={{ marginLeft: '20px' }}>
          <span className="text-black font-semibold dark:text-gray-200">{JSON.stringify(key)}</span>
          <span className="text-black dark:text-gray-200">: </span>
          <span className="text-green-600 dark:text-green-400">
            {typeof value === 'object' 
              ? formatJsonContent(value)
              : JSON.stringify(value)}
          </span>
          {index < Object.keys(content).length - 1 && (
            <span className="text-black dark:text-gray-200">,</span>
          )}
        </div>
      ))}
      <span className="text-black dark:text-white">{'}'}</span>
    </>
  );
};

export function ServerEventsList({ events, instanceName }: ServerEventsListProps) {
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  
  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: format(date, "MMM dd, yyyy"),
      time: format(date, "HH:mm:ss")
    };
  };
  
  const formatMethodDetails = (method: string, params: any) => {
    if (!method) return '';
    let details = '';
    if (method === 'tools/call' && params?.name) {
      details = params.name;
      if (params.arguments) {
        details += ` (${Object.values(params.arguments).join(', ')})`;
      }
    }
    return details;
  };
  
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-2">
        {events.length === 0 ? (
          <div className="py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                <Clock className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No events recorded</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Events will appear here when communication occurs with this instance.
            </p>
          </div>
        ) : (
          [SAMPLE_NOTIFICATION, ...events].map((event) => {
            const { date, time } = formatTimestamp(event.timestamp);
            const methodDetails = formatMethodDetails(event.method || '', event.params);
            const isSuccess = !event.isError && event.type === 'response';
            const isDebugTool = event.method === 'tools/call';
            const isNotification = event.type === 'notification';
            
            return (
              <div 
                key={event.id} 
                className={cn(
                  "border rounded-md overflow-hidden transition-all border-gray-200 dark:border-gray-800"
                )}
              >
                <div 
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-xs font-mono cursor-pointer bg-white dark:bg-gray-900"
                  )}
                  onClick={() => toggleEventExpansion(event.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-start text-gray-800 dark:text-gray-200">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">{date}</span>
                      <span className="font-semibold">{time}</span>
                    </div>

                    {isNotification ? (
                      <Bell className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    ) : event.isError ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    )}

                    {event.method && (
                      <div className="flex items-center gap-2 max-w-[300px]">
                        <span className="font-medium">{event.method}</span>
                        {methodDetails && (
                          <span className="text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                            {methodDetails}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {isDebugTool ? (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] py-0 h-5",
                          "bg-purple-100 text-purple-800 border-purple-200",
                          "dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
                        )}
                      >
                        Debug Tool
                      </Badge>
                    ) : !isNotification && (
                      <>
                        {event.profileName && (
                          <Badge 
                            variant="secondary" 
                            className="text-[10px] py-0 h-5"
                          >
                            {event.profileName}
                          </Badge>
                        )}
                        {event.hostName && (
                          <Badge 
                            variant="secondary" 
                            className="text-[10px] py-0 h-5"
                          >
                            {event.hostName}
                          </Badge>
                        )}
                      </>
                    )}
                    
                    {expandedEvents[event.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
                
                {expandedEvents[event.id] && (
                  <div className="flex flex-col">
                    {isNotification ? (
                      <div className="p-3 font-mono text-xs overflow-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center mb-2">
                          <span className="font-bold mr-2 uppercase text-purple-600 dark:text-purple-400">Notification</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {formatTimestamp(event.timestamp).time}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap break-all">
                          {formatJsonContent(event.content)}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 font-mono text-xs overflow-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                          <div className="flex items-center mb-2">
                            <span className="font-bold mr-2 uppercase text-blue-600 dark:text-blue-400">Request</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {formatTimestamp(event.timestamp).time}
                            </span>
                          </div>
                          <div className="whitespace-pre-wrap break-all">
                            {formatJsonContent(SAMPLE_REQUEST)}
                          </div>
                        </div>
                        
                        <div 
                          className={cn(
                            "p-3 font-mono text-xs overflow-auto bg-white dark:bg-gray-900 border-t",
                            isSuccess
                              ? "border-green-200 dark:border-green-800"
                              : event.isError 
                                ? "border-red-200 dark:border-red-800" 
                                : "border-gray-200 dark:border-gray-800"
                          )}
                        >
                          <div className="flex items-center mb-2">
                            <span className={cn(
                              "font-bold mr-2 uppercase text-green-600 dark:text-green-400",
                              isSuccess 
                                ? "text-green-600 dark:text-green-400" 
                                : event.isError 
                                  ? "text-red-600 dark:text-red-400" 
                                  : "text-gray-600 dark:text-gray-400"
                            )}>
                              {event.isError ? 'Error' : 'Response'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {formatTimestamp(event.timestamp).time}
                            </span>
                          </div>
                          <div className="whitespace-pre-wrap break-all">
                            {formatJsonContent(event.content)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}
