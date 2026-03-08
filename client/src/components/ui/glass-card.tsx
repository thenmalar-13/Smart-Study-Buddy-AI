import { HTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "panel" | "highlight";
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "glass rounded-2xl",
      panel: "glass-panel rounded-3xl p-6 sm:p-8",
      highlight: "bg-gradient-to-br from-primary/10 to-accent/10 border border-white/20 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(124,58,237,0.15)]",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";
