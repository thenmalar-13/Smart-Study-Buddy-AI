import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { insertStudySessionSchema, type InsertStudySession } from "@shared/schema";
import { useCreateSession } from "@/hooks/use-sessions";
import { GlassCard } from "@/components/ui/glass-card";

export default function CreateNote() {
  const [, setLocation] = useLocation();
  const createMutation = useCreateSession();
  
  const form = useForm<InsertStudySession>({
    resolver: zodResolver(insertStudySessionSchema),
    defaultValues: {
      title: "",
      topic: "",
      originalContent: "",
      difficulty: 3,
    },
  });

  const onSubmit = (data: InsertStudySession) => {
    createMutation.mutate(data, {
      onSuccess: (result) => {
        setLocation(`/notes/${result.id}`);
      },
    });
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="inline-flex items-center justify-center p-3 glass rounded-2xl mb-6">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Generate Study Notes</h1>
        <p className="text-lg text-muted-foreground">Paste your learning material below and let AI extract the core concepts and test your knowledge.</p>
      </motion.div>

      <GlassCard variant="panel" className="relative overflow-hidden">
        <AnimatePresence>
          {createMutation.isPending && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <h3 className="text-xl font-display font-semibold mb-2">Analyzing Content</h3>
              <p className="text-muted-foreground text-center max-w-sm px-4">
                Our AI is reading your text, extracting key points, writing a summary, and generating a quiz. This might take a few seconds...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Title</label>
              <input
                {...form.register("title")}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="e.g. Intro to Photosynthesis"
              />
              {form.formState.errors.title && (
                <p className="text-destructive text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" /> {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Topic/Subject</label>
              <input
                {...form.register("topic")}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="e.g. Biology"
              />
              {form.formState.errors.topic && (
                <p className="text-destructive text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" /> {form.formState.errors.topic.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-foreground">Content to Learn</label>
              <span className="text-xs text-muted-foreground">Paste article, transcript, or textbook excerpt</span>
            </div>
            <textarea
              {...form.register("originalContent")}
              rows={8}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none font-body leading-relaxed"
              placeholder="Paste your source text here..."
            />
            {form.formState.errors.originalContent && (
              <p className="text-destructive text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" /> {form.formState.errors.originalContent.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground ml-1">Self-Rated Difficulty (1-5)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="5"
                {...form.register("difficulty", { valueAsNumber: true })}
                className="w-full max-w-xs h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/20 text-primary font-bold">
                {form.watch("difficulty")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground ml-1">Helps us track your learning progress over time.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {createMutation.isPending ? (
                <>Generating Magic...</>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Study Notes & Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
