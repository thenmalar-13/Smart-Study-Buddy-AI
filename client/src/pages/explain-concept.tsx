import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Rocket, Zap, Loader2, ArrowRight } from "lucide-react";
import { insertConceptExplanationSchema, type InsertConceptExplanation } from "@shared/schema";
import { useCreateConcept, useConcepts } from "@/hooks/use-concepts";
import { GlassCard } from "@/components/ui/glass-card";

export default function ExplainConcept() {
  const createMutation = useCreateConcept();
  const { data: history } = useConcepts();
  const [activeConceptId, setActiveConceptId] = useState<number | null>(null);
  
  const form = useForm<InsertConceptExplanation>({
    resolver: zodResolver(insertConceptExplanationSchema),
    defaultValues: {
      term: "",
    },
  });

  const onSubmit = (data: InsertConceptExplanation) => {
    createMutation.mutate(data, {
      onSuccess: (result) => {
        form.reset();
        setActiveConceptId(result.id);
      },
    });
  };

  const activeConcept = history?.find(c => c.id === activeConceptId) || (history && history.length > 0 ? history[0] : null);

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center p-3 glass rounded-2xl mb-6">
          <Lightbulb className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Concept Explainer</h1>
        <p className="text-lg text-muted-foreground">Enter any complex topic, jargon, or scientific term. We'll break it down so a 5-year-old could understand it.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">What do you want explained?</label>
                <input
                  {...form.register("term")}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-lg"
                  placeholder="e.g. Quantum Entanglement"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={createMutation.isPending || !form.watch("term")}
                className="w-full px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-accent text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Explain it to me <Zap className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </GlassCard>

          {/* History List */}
          {history && history.length > 0 && (
            <div className="glass rounded-2xl overflow-hidden flex flex-col max-h-[400px]">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Recent Terms</h3>
              </div>
              <div className="overflow-y-auto p-2 space-y-1">
                {history.map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => setActiveConceptId(concept.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex justify-between items-center ${
                      (activeConcept?.id === concept.id) 
                        ? "bg-accent/20 text-white font-medium" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="truncate">{concept.term}</span>
                    {(activeConcept?.id === concept.id) && <ArrowRight className="w-4 h-4 shrink-0 text-accent" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Result Column */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {createMutation.isPending ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[500px] glass-panel rounded-3xl flex flex-col items-center justify-center text-center p-8"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
                  <Rocket className="w-12 h-12 text-accent relative z-10 animate-bounce" />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-2">Decoding complexity...</h3>
                <p className="text-muted-foreground">Finding the perfect analogy for "{form.watch("term")}"</p>
              </motion.div>
            ) : activeConcept ? (
              <motion.div
                key={activeConcept.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <GlassCard variant="panel" className="relative overflow-hidden border-t-4 border-t-accent">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Lightbulb className="w-48 h-48" />
                  </div>
                  
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent mb-4 border border-accent/20">
                      ELI5 Explanation
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
                      {activeConcept.term}
                    </h2>
                    <div className="prose prose-invert prose-lg max-w-none">
                      <p className="text-white/90 leading-relaxed font-light">
                        {activeConcept.explanation}
                      </p>
                    </div>
                  </div>
                </GlassCard>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <GlassCard className="p-6 md:p-8 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border-indigo-500/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                        <Rocket className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold mb-3 text-indigo-100">Real World Analogy</h3>
                        <p className="text-lg text-white/80 leading-relaxed italic">
                          "{activeConcept.analogy}"
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[400px] glass rounded-3xl flex flex-col items-center justify-center text-center p-8 border-dashed border-2 border-white/10"
              >
                <Lightbulb className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-display text-muted-foreground">Select or generate a concept to see the explanation here.</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
