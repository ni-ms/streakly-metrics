
import React from "react";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddHabit: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddHabit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center p-10 my-12 rounded-xl border border-dashed"
    >
      <div className="bg-gray-50 p-4 rounded-full mb-6">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 15, 0, 15, 0] }}
          transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 5 }}
        >
          <PlusCircle size={48} className="text-primary" />
        </motion.div>
      </div>
      <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Start building positive routines by creating your first habit. Track your progress and build consistency.
      </p>
      <Button onClick={onAddHabit} className="group">
        <PlusCircle size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
        Create your first habit
      </Button>
    </motion.div>
  );
};

export default EmptyState;
