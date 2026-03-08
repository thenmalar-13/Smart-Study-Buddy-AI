import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface QuizPlayerProps {
  questions: QuizQuestion[];
}

export function QuizPlayer({ questions }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentQuestion.answer;

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    if (option === currentQuestion.answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  if (!questions || questions.length === 0) return null;

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center glass rounded-2xl">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-3xl font-display font-bold mb-2">Quiz Complete!</h3>
        <p className="text-xl text-muted-foreground mb-8">
          You scored <span className="text-white font-bold">{score}</span> out of {questions.length}
        </p>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden relative">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 text-sm font-medium text-muted-foreground">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-display font-medium mb-8 text-foreground">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isActualAnswer = option === currentQuestion.answer;
              
              let optionClass = "bg-white/5 border-white/10 hover:bg-white/10";
              let Icon = null;

              if (isAnswered) {
                if (isActualAnswer) {
                  optionClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-100";
                  Icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
                } else if (isSelected) {
                  optionClass = "bg-red-500/20 border-red-500/50 text-red-100";
                  Icon = <XCircle className="w-5 h-5 text-red-400" />;
                } else {
                  optionClass = "bg-white/5 border-white/5 opacity-50";
                }
              }

              return (
                <motion.button
                  key={idx}
                  layout
                  onClick={() => handleSelect(option)}
                  disabled={isAnswered}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 text-left ${optionClass}`}
                  whileHover={!isAnswered ? { scale: 1.01 } : {}}
                  whileTap={!isAnswered ? { scale: 0.99 } : {}}
                >
                  <span className="pr-4">{option}</span>
                  {Icon}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex justify-end"
            >
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
