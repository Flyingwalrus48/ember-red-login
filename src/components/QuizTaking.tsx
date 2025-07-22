import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, RotateCcw, Home, Play, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Data structure interfaces
interface Answer {
  id: string;
  answer_text: string;
  is_correct: boolean;
}

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  image_url?: string;
  answers: Answer[];
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface UserAnswer {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
}

// Animation variants for flowing transitions
const pageVariants = {
  initial: { opacity: 0, x: 50, scale: 0.95 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: -50, scale: 0.95 }
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.6
};

// Removed unused progressVariants

const feedbackVariants = {
  initial: { scale: 0, opacity: 0, rotate: -180 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  exit: { scale: 0, opacity: 0, rotate: 180 }
};

// Floating particles component for ambient background
const FloatingParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

// Flowing progress indicator component
const FlowingProgress: React.FC<{
  current: number;
  total: number;
}> = ({ current, total }) => {
  const progressPercentage = (current / total) * 100;
  
  return (
    <div className="w-full mb-8">
      {/* Question counter */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      
      {/* Flowing progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        
        {/* Flowing shimmer effect */}
        <motion.div
          className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
      
      {/* Flowing dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(total)].map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index < current
                ? 'bg-primary'
                : index === current - 1
                ? 'bg-primary/60'
                : 'bg-muted'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
};

const QuizTaking: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  // State management
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  // Fetch quiz data from Supabase
  useEffect(() => {
    const fetchQuizData = async () => {
      if (!quizId) return;
      
      try {
        setLoading(true);
        setError(null);

        // For demo purposes, use sample data if quizId is 'sample'
        if (quizId === 'sample') {
          // Import sample data dynamically
          const { sampleQuizData } = await import('../data/sampleQuizData');
          setQuizData(sampleQuizData);
          setLoading(false);
          return;
        }

        // Try to fetch from Supabase
        const { data: quizDataResult, error: quizError } = await supabase
          .from('quizzes' as any)
          .select('*')
          .eq('id', quizId)
          .single();

        if (quizError) throw quizError;

        // Fetch questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions' as any)
          .select('*')
          .eq('quiz_id', quizId)
          .order('created_at');

        if (questionsError) throw questionsError;

        // Fetch answers for all questions
        const questionIds = questionsData?.map((q: any) => q.id) || [];
        const { data: answersData, error: answersError } = await supabase
          .from('answers' as any)
          .select('*')
          .in('question_id', questionIds)
          .order('created_at');

        if (answersError) throw answersError;

        // Group answers by question
        const questionsWithAnswers = questionsData?.map((question: any) => ({
          ...question,
          answers: answersData?.filter((answer: any) => answer.question_id === question.id) || []
        })) || [];

        if (quizDataResult) {
          const typedQuizData = quizDataResult as any;
          setQuizData({
            id: typedQuizData.id,
            title: typedQuizData.title,
            description: typedQuizData.description,
            questions: questionsWithAnswers
          });
        }
      } catch (err) {
        console.error('Error fetching quiz data:', err);
        setError('Failed to load quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  // Handle answer selection
  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswerId(answerId);
  };

  // Handle back to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0 && !isNavigatingBack) {
      setIsNavigatingBack(true);
      setSelectedAnswerId(null);
      setCurrentQuestionIndex(prev => prev - 1);
      // Remove the last answer from userAnswers if going back
      setUserAnswers(prev => prev.slice(0, -1));
      setTimeout(() => {
        setIsNavigatingBack(false);
      }, 300);
    }
  };

  // Handle exit quiz
  const handleExitQuiz = () => {
    setShowExitDialog(false);
    navigate('/quizzes');
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (!selectedAnswerId || !quizData) return;

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const selectedAnswer = currentQuestion.answers.find(a => a.id === selectedAnswerId);
    
    if (selectedAnswer) {
      const userAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedAnswerId,
        isCorrect: selectedAnswer.is_correct
      };
      
      setUserAnswers(prev => [...prev, userAnswer]);
      setShowFeedback(true);
      
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswerId(null);
        
        if (currentQuestionIndex + 1 < quizData.questions.length) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          setQuizCompleted(true);
        }
      }, 1500);
    }
  };

  // Calculate score
  const score = userAnswers.filter(answer => answer.isCorrect).length;
  const totalQuestions = quizData?.questions.length || 0;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center min-h-[60vh] relative">
        <FloatingParticles />
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Preparing your quiz...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !quizData) {
    return (
      <div className="bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center min-h-[60vh] relative">
        <FloatingParticles />
        <motion.div 
          className="text-center max-w-md px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Quiz Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || 'The requested quiz could not be loaded.'}</p>
          <Button onClick={() => navigate('/quizzes')} className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Back to Quizzes
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="relative bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      <FloatingParticles />
      
      {/* Quiz Header with Exit Button - Only show during quiz */}
      {quizStarted && !quizCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm border-b border-border"
        >
          {/* Back Button - Only show after first question */}
          {currentQuestionIndex > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handlePreviousQuestion}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm border-border hover:bg-background/90 transition-all duration-200"
                disabled={isNavigatingBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </motion.div>
          )}
          
          {/* Exit Quiz Button */}
          <div className="ml-auto">
            <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/80 backdrop-blur-sm border-border hover:bg-background/90 transition-all duration-200 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-2" />
                  Exit Quiz
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-background/95 backdrop-blur-sm border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Exit Quiz?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to exit this quiz? Your progress will not be saved and you'll need to start over.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-background/50 border-border hover:bg-background/80">
                    Continue Quiz
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleExitQuiz}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Exit Quiz
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>
      )}
      
      <div className="container mx-auto px-4 py-8 relative z-10 min-h-[calc(100vh-theme(spacing.16))]">
        {/* Content container with proper spacing */}
        <div className="">
        <AnimatePresence mode="wait">
          {/* Quiz Introduction Screen */}
          {!quizStarted && (
            <motion.div
              key="intro"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
              className="max-w-2xl mx-auto text-center flex flex-col justify-center min-h-[60vh]"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-8"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white ml-1" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {quizData.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
                  {quizData.description}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-4"
              >
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{quizData.questions.length}</div>
                      <div className="text-sm text-muted-foreground">Questions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">~{quizData.questions.length * 2}</div>
                      <div className="text-sm text-muted-foreground">Minutes</div>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => setQuizStarted(true)}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transform hover:scale-105 transition-all duration-200"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Quiz
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Quiz Questions */}
          {quizStarted && !quizCompleted && (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
              className="max-w-4xl mx-auto"
            >
              <FlowingProgress 
                current={currentQuestionIndex + 1} 
                total={quizData.questions.length} 
              />
              
              <Card className="bg-card/80 backdrop-blur-sm border-border shadow-2xl">
                <CardContent className="p-8">
                  {/* Question Image */}
                  {currentQuestion.image_url && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mb-8"
                    >
                      <img
                        src={currentQuestion.image_url}
                        alt="Question visual"
                        className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                      />
                    </motion.div>
                  )}
                  
                  {/* Question Text */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-3xl font-bold mb-8 text-center leading-relaxed"
                  >
                    {currentQuestion.question_text}
                  </motion.h2>
                  
                  {/* Answer Options */}
                  <div className="space-y-4 mb-8">
                    {currentQuestion.answers.map((answer, index) => (
                      <motion.div
                        key={answer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="relative"
                      >
                        <button
                          onClick={() => handleAnswerSelect(answer.id)}
                          disabled={showFeedback}
                          className={`w-full p-6 text-left rounded-lg border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                            selectedAnswerId === answer.id
                              ? 'border-primary bg-primary/10 shadow-lg'
                              : 'border-border bg-card/50 hover:border-primary/50 hover:bg-card/80'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswerId === answer.id
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}>
                              {selectedAnswerId === answer.id && (
                                <div className="w-3 h-3 bg-white rounded-full" />
                              )}
                            </div>
                            <span className="text-lg font-medium">{answer.answer_text}</span>
                          </div>
                        </button>
                        
                        {/* Feedback Icons */}
                        <AnimatePresence>
                          {showFeedback && selectedAnswerId === answer.id && (
                            <motion.div
                              variants={feedbackVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              transition={{ duration: 0.4 }}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2"
                            >
                              {answer.is_correct ? (
                                <CheckCircle className="w-8 h-8 text-green-500" />
                              ) : (
                                <XCircle className="w-8 h-8 text-red-500" />
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    {/* Back Button - only show if not first question and not on mobile */}
                    {currentQuestionIndex > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hidden sm:block"
                      >
                        <Button
                          onClick={handlePreviousQuestion}
                          variant="outline"
                          size="lg"
                          className="h-14 px-8 text-lg font-semibold border-2 hover:bg-background/80"
                          disabled={isNavigatingBack || showFeedback}
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Previous
                        </Button>
                      </motion.div>
                    )}
                    
                    {/* Next Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: selectedAnswerId ? 1 : 0.5, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1"
                    >
                      <Button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswerId || showFeedback}
                        size="lg"
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {currentQuestionIndex + 1 === quizData.questions.length ? 'Complete Quiz' : 'Next Question'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quiz Completion Summary */}
          {quizCompleted && (
            <motion.div
              key="completion"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
              className="max-w-2xl mx-auto text-center flex flex-col justify-center min-h-[60vh]"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-8"
              >
                <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  percentage >= 80 ? 'bg-gradient-to-br from-green-500 to-green-600' :
                  percentage >= 60 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                  'bg-gradient-to-br from-red-500 to-red-600'
                }`}>
                  <span className="text-4xl font-bold text-white">{percentage}%</span>
                </div>
                
                <h1 className="text-4xl font-bold mb-4">
                  {percentage >= 80 ? 'Excellent Work!' :
                   percentage >= 60 ? 'Good Job!' :
                   'Keep Practicing!'}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-2">
                  You scored {score} out of {totalQuestions} questions correctly
                </p>
                
                <div className="text-lg text-muted-foreground">
                  {percentage >= 80 ? 'Outstanding performance! You\'ve mastered this topic.' :
                   percentage >= 60 ? 'Well done! Review the missed questions to improve further.' :
                   'Don\'t worry, practice makes perfect. Try again to improve your score.'}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-4"
              >
                <Button
                  onClick={() => {
                    setQuizStarted(false);
                    setQuizCompleted(false);
                    setCurrentQuestionIndex(0);
                    setUserAnswers([]);
                    setSelectedAnswerId(null);
                  }}
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-lg font-semibold"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake Quiz
                </Button>
                
                <Button
                  onClick={() => navigate('/quizzes')}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Quizzes
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;