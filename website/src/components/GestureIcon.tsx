"use client";

import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MousePointer,
  Undo,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Maximize,
  Hand,
  Move,
} from "lucide-react";

interface GestureIconProps {
  name: string;
  className?: string;
}

export function GestureIcon({ name, className = "" }: GestureIconProps) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "arrow-up": ArrowUp,
    "arrow-down": ArrowDown,
    "arrow-left": ArrowLeft,
    "arrow-right": ArrowRight,
    "pointer": MousePointer,
    "undo": Undo,
    "refresh-cw": RefreshCw,
    "chevron-up": ChevronUp,
    "chevron-down": ChevronDown,
    "maximize": Maximize,
    "hand": Hand,
    "mouse-pointer": MousePointer,
    "fist": Hand,
    "move": Move,
  };

  const Icon = iconMap[name] || Hand;

  return <Icon className={className} />;
}
