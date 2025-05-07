
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GuidedTourOverlayProps {
  targetElementId: string;
  onClose: () => void;
  isVisible: boolean;
}

export const GuidedTourOverlay: React.FC<GuidedTourOverlayProps> = ({ 
  targetElementId,
  onClose,
  isVisible
}) => {
  const [targetPosition, setTargetPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const findTargetElement = () => {
      const targetElement = document.getElementById(targetElementId);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setTargetPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      } else {
        // If element not found yet, retry
        setTimeout(findTargetElement, 200);
      }
    };

    findTargetElement();
    
    // Add click event listener to close the overlay when clicked anywhere
    const handleClick = () => onClose();
    document.addEventListener("click", handleClick);
    
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [targetElementId, isVisible, onClose]);

  if (!isVisible || !targetPosition) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      {/* Create a cutout around the target element */}
      <div 
        className="absolute"
        style={{
          top: targetPosition.top - 10,
          left: targetPosition.left - 10,
          width: targetPosition.width + 20,
          height: targetPosition.height + 20,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
          borderRadius: '8px',
          zIndex: 1
        }}
      />
      
      {/* Hand pointer animation */}
      <motion.div
        className="absolute z-10"
        style={{
          top: targetPosition.top + targetPosition.height / 2,
          left: targetPosition.left - 60,
        }}
        initial={{ x: -20, scale: 0.9 }}
        animate={{ x: 10, scale: 1 }}
        transition={{ 
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.8
        }}
      >
        <img 
          src="/lovable-uploads/9e1ea397-05e0-47e7-b299-5d6dce07f2cc.png" 
          alt="Pointer hand" 
          className="w-16 h-16 rotate-12"
        />
      </motion.div>

      {/* Guidance text */}
      <div 
        className="absolute bg-white text-black p-4 rounded-lg shadow-lg"
        style={{
          top: targetPosition.top + targetPosition.height + 20,
          left: targetPosition.left,
          zIndex: 10,
          maxWidth: '250px'
        }}
      >
        <p className="font-medium text-sm">点击此处添加服务器到您的配置文件</p>
      </div>
    </div>
  );
};
