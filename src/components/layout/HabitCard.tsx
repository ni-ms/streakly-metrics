import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MoreVertical, Trash2, Edit, Calendar, BarChart3 } from "lucide-react";
import { Habit } from "@/types/habit";
import { calculateHabitStats, toggleHabitCompletion } from "@/utils/habitUtils";
import StreakCounter from "./StreakCounter";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getDateRangeArray } from "@/utils/habitUtils";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [localCompletionState, setLocalCompletionState] = useState<boolean>(
    habit.completedDates.includes(new Date().toISOString().split('T')[0])
  );
  
  const stats = calculateHabitStats(habit);
  
  const handleToggleCompletion = useCallback(async () => {
    if (isCompleting) return;
    
    const today = new Date().toISOString().split('T')[0];
    const isCurrentlyCompleted = habit.completedDates.includes(today);
    setLocalCompletionState(!isCurrentlyCompleted);
    setIsCompleting(true);
    
    try {
      await toggleHabitCompletion(habit.id);
    } finally {
      setIsCompleting(false);
    }
  }, [habit.id, habit.completedDates, isCompleting]);

  const last7Days = getDateRangeArray(7);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl border shadow-sm overflow-hidden hover-lift"
      >
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${habit.color}`}
              >
                <span className="text-white font-semibold">{habit.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h3 className="font-medium text-lg">{habit.name}</h3>
                {habit.description && (
                  <p className="text-muted-foreground text-sm line-clamp-1">
                    {habit.description}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical size={16} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(habit)}>
                  <Edit size={14} className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowStatsDialog(true)}>
                  <BarChart3 size={14} className="mr-2" />
                  View Stats
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <StreakCounter streak={stats.currentStreak} />
            
            <motion.button
              onClick={handleToggleCompletion}
              disabled={isCompleting}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                localCompletionState 
                  ? `${habit.color} shadow-md` 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {localCompletionState ? (
                  <motion.div
                    key="checked"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white"
                  >
                    <Check size={20} strokeWidth={3} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="unchecked"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check size={20} className="text-gray-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between">
              {last7Days.map((date, i) => {
                const isCompleted = habit.completedDates.includes(date);
                const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
                
                return (
                  <div key={date} className="flex flex-col items-center">
                    <div className="text-xs text-muted-foreground mb-1">{day}</div>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? `${habit.color} text-white` 
                          : 'bg-gray-100'
                      }`}
                    >
                      {isCompleted && <Check size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Habit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{habit.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete(habit.id);
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{habit.name} Stats</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Current Streak</p>
              <p className="text-2xl font-semibold flex items-center">
                {stats.currentStreak} 
                <span className="text-sm font-normal ml-1">
                  {stats.currentStreak === 1 ? "day" : "days"}
                </span>
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Longest Streak</p>
              <p className="text-2xl font-semibold flex items-center">
                {stats.longestStreak} 
                <span className="text-sm font-normal ml-1">
                  {stats.longestStreak === 1 ? "day" : "days"}
                </span>
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Completion Rate</p>
              <p className="text-2xl font-semibold flex items-center">
                {stats.completionRate}
                <span className="text-sm font-normal ml-1">%</span>
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Total Completions</p>
              <p className="text-2xl font-semibold">{stats.totalCompletions}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HabitCard;
