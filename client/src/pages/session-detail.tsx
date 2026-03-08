import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, ListChecks, Target, Trash2, Calendar } from "lucide-react";
import { useSession, useDeleteSession } from "@/hooks/use-sessions";
import { GlassCard } from "@/components/ui/glass-card";
import { QuizPlayer } from "@/components/quiz-player";

export default function SessionDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: session, isLoading, isError } = useSession(Number(id));
  const deleteMutation = useDeleteSession();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this study session?")) {
      await deleteMutation.mutateAsync(Number(id));
      setLocation("/");
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen flex justify-center items-start">
        <div className="animate-pulse space-y-8 w-full max-w-5xl px-4">
          <div className="h-8 bg-white/10 rounded w-1/4"></div>
          <div className="h-20 bg-white/5 rounded-2xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-white/5 rounded-2xl"></div>
            <div className="h-64 bg-white/5 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="pt-24 min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-2xl font-display font-bold mb-4">Session Not Found</h2>
        <Link href="/" className="text-primary hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
      >
        <div>
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-white transition-colors mb-4 group">
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/20">
              {session.topic}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/10 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(session.createdAt!).toLocaleDateString()}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/20 flex items-center gap-1">
              Difficulty: {session.difficulty}/5
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold">{session.title}</h1>
        </div>
        
        <button 
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="self-start sm:self-auto p-3 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors border border-transparent hover:border-red-400/20"
          title="Delete Session"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Summary Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-display font-bold">AI Summary</h2>
            </div>
            <GlassCard className="p-6 md:p-8 leading-relaxed text-lg text-white/90 font-light">
              {session.summary}
            </GlassCard>
          </motion.section>

          {/* Key Points Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4 mt-12">
              <ListChecks className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-display font-bold">Key Takeaways</h2>
            </div>
            <div className="grid gap-4">
              {session.keyPoints.map((point, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="glass p-5 rounded-xl flex items-start gap-4 border-l-4 border-l-accent"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-lg text-white/80">{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="lg:col-span-1">
          {/* Sticky Quiz Section */}
          <div className="sticky top-24">
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-display font-bold">Test Knowledge</h2>
              </div>
              <QuizPlayer questions={session.quizQuestions} />
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
