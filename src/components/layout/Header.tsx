
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AddHabitDialog from "./AddHabitDialog";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good morning");
      } else if (hour < 18) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    };

    const updateDate = () => {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      };
      setDate(new Date().toLocaleDateString('en-US', options));
    };

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    updateGreeting();
    updateDate();
    window.addEventListener('scroll', handleScroll);

    // Update time every minute
    const timer = setInterval(() => {
      updateGreeting();
      updateDate();
    }, 60000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-10 w-full transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl font-bold"
            >
              Habit Tracker
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              {date}
            </motion.p>
          </div>
          <Button 
            onClick={() => setShowAddHabit(true)}
            className="bg-primary hover:bg-primary/90 transition-all duration-200"
          >
            <Plus size={18} className="mr-1" />
            New Habit
          </Button>
        </div>
      </motion.header>
      <div className="container mx-auto px-4 mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-3xl font-semibold tracking-tight"
        >
          {greeting}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-muted-foreground mt-1"
        >
          Track your habits and build consistency
        </motion.p>
      </div>

      <AddHabitDialog open={showAddHabit} onOpenChange={setShowAddHabit} />
    </>
  );
};

export default Header;

// Add this at the end of the file
declare module "framer-motion" {
  export const motion: any;
}
