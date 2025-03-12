import React from "react";
import { cn } from "@/lib/utils";

interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  className?: string;
}

export function Heading({ 
  as: Component = "h2", 
  children, 
  className 
}: HeadingProps) {
  return (
    <Component className={cn("font-bold", className)}>
      {children}
    </Component>
  );
}