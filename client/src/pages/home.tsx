import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Brain, ArrowRight, LibraryBig, PenTool } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30 text-primary mb-8">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI-Powered Learning</span>
        </motion.div>
        
        <motion.h1 variants={item} className="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-tight">
          Master any topic with <br />
          <span className="text-gradient">Smart Study Buddy</span>
        </motion.h1>
        
        <motion.p variants={item} className="text-lg md:text-xl text-muted-foreground mb-10">
          Instantly generate summaries, key points, quizzes, and ELI5 explanations for complex concepts. Learn faster, remember more.
        </motion.p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full"
      >
        <motion.div variants={item} whileHover={{ y: -5 }}>
          <Link href="/notes/new" className="block h-full">
            <GlassCard variant="highlight" className="h-full group cursor-pointer p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/25">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-400 transition-all">
                Create Study Notes
              </h3>
              <p className="text-muted-foreground mb-6">
                Paste any article or text. We'll extract the core knowledge, generate a summary, and test your understanding with a custom quiz.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </GlassCard>
          </Link>
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -5 }}>
          <Link href="/concepts" className="block h-full">
            <GlassCard variant="highlight" className="h-full group cursor-pointer p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-accent/20 blur-3xl rounded-full group-hover:bg-accent/30 transition-colors" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 transition-all">
                Concept Explainer
              </h3>
              <p className="text-muted-foreground mb-6">
                Stuck on a complex term? Get a clear, jargon-free "Explain Like I'm 5" breakdown along with a relatable real-world analogy.
              </p>
              <div className="flex items-center text-accent font-medium group-hover:gap-2 transition-all">
                Explain a Concept <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </GlassCard>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full border-t border-white/5 pt-12"
      >
        {[
          { icon: LibraryBig, title: "Organized Library", desc: "All your study sessions saved automatically." },
          { icon: Brain, title: "Smart Summaries", desc: "Powered by advanced AI models." },
          { icon: PenTool, title: "Active Recall", desc: "Auto-generated quizzes to test memory." }
        ].map((feature, i) => (
          <motion.div key={i} variants={item} className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center mb-4 border-white/10">
              <feature.icon className="w-6 h-6 text-muted-foreground" />
            </div>
            <h4 className="font-display font-semibold mb-2">{feature.title}</h4>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
