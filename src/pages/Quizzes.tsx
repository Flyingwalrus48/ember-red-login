import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Target, Flame, Droplets, Shield, Building, Zap, Heart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Quiz {
  id: string;
  title: string;
  description: string;
  duration?: string;
  questions?: number;
  icon?: any;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  progress?: number;
  status?: 'Not Started' | 'In Progress' | 'Completed';
  created_at?: string;
}

interface DatabaseQuiz {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

const defaultIcons = [Flame, Building, Zap, Droplets, Shield, Heart, BookOpen];

const getRandomIcon = () => {
  return defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
};

const mapDatabaseQuizToQuiz = (dbQuiz: DatabaseQuiz): Quiz => {
  return {
    id: dbQuiz.id,
    title: dbQuiz.title,
    description: dbQuiz.description,
    duration: "20 min",
    questions: 15,
    icon: getRandomIcon(),
    difficulty: 'Beginner',
    progress: 0,
    status: 'Not Started',
    created_at: dbQuiz.created_at
  };
};

export default function Quizzes() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const mappedQuizzes = data ? data.map(mapDatabaseQuizToQuiz) : [];
      setQuizzes(mappedQuizzes);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizClick = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Advanced': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-muted';
    if (progress === 100) return 'bg-green-500';
    return 'bg-primary';
  };

  const completedQuizzes = quizzes.filter(q => q.status === 'Completed').length;
  const inProgressQuizzes = quizzes.filter(q => q.status === 'In Progress').length;
  const totalProgress = quizzes.length > 0 ? Math.round(quizzes.reduce((acc, quiz) => acc + (quiz.progress || 0), 0) / quizzes.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchQuizzes}>Try Again</Button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Firefighter Exam Prep
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your journey to acing the exam starts here. Select a module to begin.
            </p>
          </div>
          
          {/* Progress Overview */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 min-w-[150px]">
              <div className="text-2xl font-bold text-foreground">{completedQuizzes}/{quizzes.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 min-w-[150px]">
              <div className="text-2xl font-bold text-foreground">{inProgressQuizzes}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 min-w-[150px]">
              <div className="text-2xl font-bold text-foreground">{totalProgress}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
          </div>
        </div>

        {/* Enhanced Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No quizzes available yet</h3>
              <p className="text-muted-foreground">Check back soon for new quiz content!</p>
            </div>
          ) : (
            quizzes.map((quiz) => {
              const Icon = quiz.icon || BookOpen;
              return (
                <Card 
                  key={quiz.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] border-muted/50 bg-card/80 backdrop-blur-sm relative overflow-hidden"
                  onClick={() => handleQuizClick(quiz.id)}
                >
                  {/* Status indicator */}
                  {quiz.status === 'Completed' && (
                    <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge className={`text-xs ${getDifficultyColor(quiz.difficulty || 'Beginner')}`}>
                          {quiz.difficulty || 'Beginner'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {quiz.duration || '20 min'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {quiz.questions || 15}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                      {quiz.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <CardDescription className="text-sm leading-relaxed mb-4">
                      {quiz.description}
                    </CardDescription>
                    
                    {/* Progress Section */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className={`font-medium ${
                          quiz.status === 'Completed' ? 'text-green-400' : 
                          quiz.status === 'In Progress' ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {quiz.status || 'Not Started'}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={quiz.progress || 0} className="h-2" />
                        <div 
                          className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${getProgressColor(quiz.progress || 0)}`}
                          style={{ width: `${quiz.progress || 0}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {quiz.progress || 0}% Complete
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full group-hover:bg-primary/90 transition-all duration-200"
                      variant={quiz.status === 'Completed' ? 'secondary' : 'default'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuizClick(quiz.id);
                      }}
                    >
                      {quiz.status === 'Completed' ? 'Review Quiz' : 
                       quiz.status === 'In Progress' ? 'Continue Quiz' : 'Start Quiz'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>

        {/* Enhanced Footer Message */}
        <div className="text-center mt-16">
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-muted-foreground mb-2">
              🚀 More quizzes coming soon! Track your progress and identify areas for improvement.
            </p>
            <p className="text-sm text-muted-foreground">
              Complete all modules to unlock advanced certification preparation materials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}