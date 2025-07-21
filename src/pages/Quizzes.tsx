import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Target, Flame, Droplets, Shield, Building, Zap, Heart } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: number;
  icon: any;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

const quizzes: Quiz[] = [
  {
    id: "nfpa-1001-ch5",
    title: "NFPA 1001 - Chapter 5: Fire Behavior",
    description: "Master the fundamentals of fire behavior, including heat transfer, combustion, and fire development patterns.",
    duration: "25 min",
    questions: 20,
    icon: Flame,
    difficulty: 'Beginner',
    progress: 75,
    status: 'In Progress'
  },
  {
    id: "nfpa-1001-ch6",
    title: "NFPA 1001 - Chapter 6: Building Construction",
    description: "Learn about different building types, construction materials, and structural considerations for firefighting operations.",
    duration: "30 min",
    questions: 25,
    icon: Building,
    difficulty: 'Intermediate',
    progress: 100,
    status: 'Completed'
  },
  {
    id: "nfpa-1001-ch7",
    title: "NFPA 1001 - Chapter 7: Portable Fire Extinguishers",
    description: "Understand the types, classifications, and proper use of portable fire extinguishers in various scenarios.",
    duration: "20 min",
    questions: 15,
    icon: Zap,
    difficulty: 'Beginner',
    progress: 0,
    status: 'Not Started'
  },
  {
    id: "nfpa-1001-ch8",
    title: "NFPA 1001 - Chapter 8: Water Supply",
    description: "Study water supply systems, hydrants, and water flow calculations essential for fire suppression.",
    duration: "35 min",
    questions: 30,
    icon: Droplets,
    difficulty: 'Advanced',
    progress: 40,
    status: 'In Progress'
  },
  {
    id: "hazmat-basics",
    title: "Hazardous Materials - Basics",
    description: "Essential knowledge about hazmat identification, classification, and initial response procedures.",
    duration: "40 min",
    questions: 35,
    icon: Shield,
    difficulty: 'Intermediate',
    progress: 0,
    status: 'Not Started'
  },
  {
    id: "emt-assessment",
    title: "Emergency Medical - Patient Assessment",
    description: "Learn systematic patient assessment techniques and emergency medical protocols for first responders.",
    duration: "30 min",
    questions: 25,
    icon: Heart,
    difficulty: 'Intermediate',
    progress: 0,
    status: 'Not Started'
  }
];

export default function Quizzes() {
  const navigate = useNavigate();

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
  const totalProgress = Math.round(quizzes.reduce((acc, quiz) => acc + quiz.progress, 0) / quizzes.length);


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
          {quizzes.map((quiz) => {
            const Icon = quiz.icon;
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
                      <Badge className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {quiz.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {quiz.questions}
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
                        {quiz.status}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={quiz.progress} className="h-2" />
                      <div 
                        className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${getProgressColor(quiz.progress)}`}
                        style={{ width: `${quiz.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {quiz.progress}% Complete
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
          })}
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