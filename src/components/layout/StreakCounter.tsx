
import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  streak: number;
  className?: string;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streak, className }) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-center gap-1 text-sm font-medium py-1 px-3 rounded-full",
        streak > 0 ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-500",
        className
      )}
    >
      <Flame 
        size={16} 
        className={cn(
          "transition-all duration-300",
          streak > 0 && "text-orange-500 animate-pulse-scale"
        )} 
      />
      <span>{streak} {streak === 1 ? "day" : "days"}</span>
    </div>
  );
};

export default StreakCounter;
