
import { Habit, HabitStats } from "@/types/habit";
import { toast } from "sonner";

// Local Storage Key
const HABITS_STORAGE_KEY = "habit-tracker-habits";

// Get habits from localStorage
export const getHabits = (): Habit[] => {
  const habitsJson = localStorage.getItem(HABITS_STORAGE_KEY);
  if (!habitsJson) return [];
  
  try {
    return JSON.parse(habitsJson);
  } catch (error) {
    console.error("Error parsing habits from localStorage:", error);
    return [];
  }
};

// Save habits to localStorage
export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
};

// Add a new habit
export const addHabit = (habit: Omit<Habit, "id" | "createdAt" | "completedDates">): Habit => {
  const habits = getHabits();
  
  const newHabit: Habit = {
    ...habit,
    id: generateId(),
    createdAt: new Date().toISOString(),
    completedDates: [],
  };
  
  saveHabits([...habits, newHabit]);
  toast.success("Habit created successfully");
  return newHabit;
};

// Update an existing habit
export const updateHabit = (updatedHabit: Habit): void => {
  const habits = getHabits();
  const index = habits.findIndex(h => h.id === updatedHabit.id);
  
  if (index === -1) {
    toast.error("Habit not found");
    return;
  }
  
  habits[index] = updatedHabit;
  saveHabits(habits);
  toast.success("Habit updated successfully");
};

// Delete a habit
export const deleteHabit = (habitId: string): void => {
  const habits = getHabits();
  const filteredHabits = habits.filter(h => h.id !== habitId);
  
  if (filteredHabits.length === habits.length) {
    toast.error("Habit not found");
    return;
  }
  
  saveHabits(filteredHabits);
  toast.success("Habit deleted successfully");
};

// Toggle completion for a habit on a specific date
export const toggleHabitCompletion = (habitId: string, date: Date = new Date()): Habit | null => {
  const habits = getHabits();
  const index = habits.findIndex(h => h.id === habitId);
  
  if (index === -1) {
    toast.error("Habit not found");
    return null;
  }
  
  const habit = {...habits[index]};
  const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
  if (habit.completedDates.includes(dateString)) {
    // Remove the date if already completed
    habit.completedDates = habit.completedDates.filter(d => d !== dateString);
    toast("Habit marked as incomplete", {
      description: `You've unmarked "${habit.name}" for today`,
    });
  } else {
    // Add the date if not already completed
    habit.completedDates.push(dateString);
    toast("Habit completed!", {
      description: `You've completed "${habit.name}" for today`,
    });
  }
  
  habits[index] = habit;
  saveHabits(habits);
  return habit;
};

// Check if a habit is completed on a specific date
export const isHabitCompletedOnDate = (habit: Habit, date: Date = new Date()): boolean => {
  const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  return habit.completedDates.includes(dateString);
};

// Calculate habit statistics
export const calculateHabitStats = (habit: Habit): HabitStats => {
  const sortedDates = [...habit.completedDates].sort();
  
  // Current streak
  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  let checkDate = new Date();
  
  // Check if today is completed
  const todayCompleted = isHabitCompletedOnDate(habit, checkDate);
  
  if (todayCompleted) {
    currentStreak = 1;
    
    // Check previous days
    for (let i = 1; i <= 366; i++) { // Check up to a year back
      checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const dateToCheck = checkDate.toISOString().split('T')[0];
      
      if (habit.completedDates.includes(dateToCheck)) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    // If today is not completed, check if yesterday was completed
    checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterday = checkDate.toISOString().split('T')[0];
    
    if (habit.completedDates.includes(yesterday)) {
      currentStreak = 1;
      
      // Check previous days
      for (let i = 2; i <= 366; i++) { // Start from 2 days ago
        checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const dateToCheck = checkDate.toISOString().split('T')[0];
        
        if (habit.completedDates.includes(dateToCheck)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }
  
  // Longest streak
  let longestStreak = 0;
  let currentLongestStreak = 0;
  let prevDate: Date | null = null;
  
  for (const dateStr of sortedDates) {
    const currentDate = new Date(dateStr);
    
    if (prevDate) {
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        currentLongestStreak++;
      } else {
        // Break in streak
        longestStreak = Math.max(longestStreak, currentLongestStreak);
        currentLongestStreak = 1;
      }
    } else {
      currentLongestStreak = 1;
    }
    
    prevDate = currentDate;
  }
  
  longestStreak = Math.max(longestStreak, currentLongestStreak);
  
  // Completion rate and total completions
  const totalCompletions = habit.completedDates.length;
  
  // Calculate completion rate based on days since creation
  const creationDate = new Date(habit.createdAt);
  const daysSinceCreation = Math.max(1, Math.floor((new Date().getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24)));
  const completionRate = Math.round((totalCompletions / daysSinceCreation) * 100);
  
  return {
    currentStreak,
    longestStreak,
    completionRate,
    totalCompletions,
  };
};

// Helper function to generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get sample habit colors
export const habitColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-lime-500",
];

// Get a date range for the last n days
export const getDateRangeArray = (days: number): string[] => {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};
