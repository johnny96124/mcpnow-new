
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface GuidedTourOverlayProps {
  targetElementId: string;
  message: string;
  onClose: () => void;
  showHand?: boolean;
}

const GuidedTourOverlay: React.FC<GuidedTourOverlayProps> = ({
  targetElementId,
  message,
  onClose,
  showHand = true
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  
  useEffect(() => {
    const positionOverlay = () => {
      const targetElement = document.getElementById(targetElementId);
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        });
      }
    };

    // Position initially and on resize
    positionOverlay();
    window.addEventListener('resize', positionOverlay);
    
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(positionOverlay, 500);
    
    return () => {
      window.removeEventListener('resize', positionOverlay);
      clearTimeout(timer);
    };
  }, [targetElementId]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-hidden">
      {/* Transparent hole around the target element */}
      <div 
        className="absolute bg-transparent pointer-events-none"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
          height: `${position.height}px`,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)'
        }}
      />
      
      {/* Hand pointer pointing to the element */}
      {showHand && (
        <div 
          className="absolute pointer-events-none animate-pulse"
          style={{
            top: `${position.top + position.height/2}px`,
            left: `${position.left + position.width + 10}px`,
            transform: 'translateY(-50%)',
          }}
        >
          <img 
            src="/lovable-uploads/af4ea4bf-1f84-45fb-bdc5-fc5b722033a5.png" 
            alt="Click here" 
            className="h-16 w-16 -rotate-45"
          />
        </div>
      )}

      {/* Tooltip message */}
      <div 
        className="absolute bg-white text-black p-4 rounded-lg shadow-lg"
        style={{
          top: `${position.top - 70}px`,
          left: `${position.left + position.width/2}px`,
          transform: 'translateX(-50%)',
          maxWidth: '250px'
        }}
      >
        <p className="text-center">{message}</p>
        <Button 
          onClick={onClose} 
          className="absolute top-2 right-2"
          size="sm"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
        <div 
          className="absolute w-4 h-4 bg-white rotate-45"
          style={{
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      </div>
      
      {/* Make the target element clickable */}
      <div 
        className="absolute cursor-pointer"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
          height: `${position.height}px`,
          zIndex: 51
        }}
        onClick={() => {
          // Click the actual element
          const targetElement = document.getElementById(targetElementId);
          if (targetElement) {
            targetElement.click();
          }
          onClose();
        }}
      />
    </div>
  );
};

export default GuidedTourOverlay;
