
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addHabit, habitColors, updateHabit } from "@/utils/habitUtils";
import { Habit, Frequency } from "@/types/habit";
import { CheckCheck, AlarmClock, BookOpen, Dumbbell, Brain, Heart, Coffee, Utensils, Droplets, Moon } from "lucide-react";

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habitToEdit?: Habit;
}

const icons = [
  { id: "check", icon: <CheckCheck size={16} />, label: "Default" },
  { id: "clock", icon: <AlarmClock size={16} />, label: "Clock" },
  { id: "book", icon: <BookOpen size={16} />, label: "Book" },
  { id: "dumbbell", icon: <Dumbbell size={16} />, label: "Exercise" },
  { id: "brain", icon: <Brain size={16} />, label: "Brain" },
  { id: "heart", icon: <Heart size={16} />, label: "Heart" },
  { id: "coffee", icon: <Coffee size={16} />, label: "Coffee" },
  { id: "food", icon: <Utensils size={16} />, label: "Food" },
  { id: "water", icon: <Droplets size={16} />, label: "Water" },
  { id: "sleep", icon: <Moon size={16} />, label: "Sleep" },
];

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({ 
  open, 
  onOpenChange,
  habitToEdit
}) => {
  const [name, setName] = useState(habitToEdit?.name || "");
  const [description, setDescription] = useState(habitToEdit?.description || "");
  const [color, setColor] = useState(habitToEdit?.color || habitColors[0]);
  const [icon, setIcon] = useState(habitToEdit?.icon || "check");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">(
    habitToEdit?.frequency.type || "daily"
  );

  const isEditing = !!habitToEdit;

  const resetForm = () => {
    setName("");
    setDescription("");
    setColor(habitColors[0]);
    setIcon("check");
    setFrequency("daily");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    if (isEditing && habitToEdit) {
      updateHabit({
        ...habitToEdit,
        name,
        description,
        color,
        icon,
        frequency: {
          type: frequency,
          daysOfWeek: frequency === "daily" ? [0, 1, 2, 3, 4, 5, 6] : habitToEdit.frequency.daysOfWeek,
          customInterval: habitToEdit.frequency.customInterval
        }
      });
    } else {
      addHabit({
        name,
        description,
        color,
        icon,
        frequency: {
          type: frequency,
          daysOfWeek: frequency === "daily" ? [0, 1, 2, 3, 4, 5, 6] : undefined,
        }
      });
    }
    
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Habit" : "Create a new habit"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update your habit details below." 
              : "Add a new habit to track. Be specific to increase your chances of success."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Read for 20 minutes"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why are you building this habit?"
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {habitColors.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={`w-8 h-8 rounded-full ${colorOption} transition-all duration-200 ${
                    color === colorOption 
                      ? "ring-2 ring-offset-2 ring-black scale-110" 
                      : "hover:scale-110"
                  }`}
                  onClick={() => setColor(colorOption)}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(value: "daily" | "weekly" | "custom") => setFrequency(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Create Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
