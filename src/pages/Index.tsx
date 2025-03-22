
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHabits, deleteHabit } from "@/utils/habitUtils";
import { Habit } from "@/types/habit";
import Header from "@/components/layout/Header";
import HabitCard from "@/components/layout/HabitCard";
import EmptyState from "@/components/layout/EmptyState";
import AddHabitDialog from "@/components/layout/AddHabitDialog";

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Memoized function to load habits
  const loadHabits = useCallback(() => {
    const storedHabits = getHabits();
    setHabits(storedHabits);
    if (loading) setLoading(false);
  }, [loading]);

  useEffect(() => {
    // Initial load
    loadHabits();

    // Set up an interval to refresh habits (for streak calculations)
    const intervalId = setInterval(loadHabits, 30000); // Refresh every 30 seconds

    // Set up an event listener for storage changes (when habit is modified in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "habit-tracker-habits" || e.key === null) {
        loadHabits();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadHabits]);

  const handleEditHabit = useCallback((habit: Habit) => {
    setEditingHabit(habit);
    setShowAddHabit(true);
  }, []);

  const handleDeleteHabit = useCallback((id: string) => {
    deleteHabit(id);
    setHabits(prev => prev.filter(habit => habit.id !== id));
  }, []);

  const handleAddHabitDialogClose = useCallback((open: boolean) => {
    setShowAddHabit(open);
    if (!open) {
      setEditingHabit(undefined);
      // Refresh habits list
      loadHabits();
    }
  }, [loadHabits]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse-scale w-12 h-12 bg-primary/20 rounded-full"></div>
          </div>
        ) : habits.length === 0 ? (
          <EmptyState onAddHabit={() => setShowAddHabit(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onEdit={handleEditHabit}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AddHabitDialog 
        open={showAddHabit} 
        onOpenChange={handleAddHabitDialogClose}
        habitToEdit={editingHabit}
      />
    </div>
  );
};

export default Index;
