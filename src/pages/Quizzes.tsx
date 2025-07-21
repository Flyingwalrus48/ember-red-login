import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Target } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: number;
}

const quizzes: Quiz[] = [
  {
    id: "nfpa-1001-ch5",
    title: "NFPA 1001 - Chapter 5: Fire Behavior",
    description: "Master the fundamentals of fire behavior, including heat transfer, combustion, and fire development patterns.",
    duration: "25 min",
    questions: 20
  },
  {
    id: "nfpa-1001-ch6",
    title: "NFPA 1001 - Chapter 6: Building Construction",
    description: "Learn about different building types, construction materials, and structural considerations for firefighting operations.",
    duration: "30 min",
    questions: 25
  },
  {
    id: "nfpa-1001-ch7",
    title: "NFPA 1001 - Chapter 7: Portable Fire Extinguishers",
    description: "Understand the types, classifications, and proper use of portable fire extinguishers in various scenarios.",
    duration: "20 min",
    questions: 15
  },
  {
    id: "nfpa-1001-ch8",
    title: "NFPA 1001 - Chapter 8: Water Supply",
    description: "Study water supply systems, hydrants, and water flow calculations essential for fire suppression.",
    duration: "35 min",
    questions: 30
  },
  {
    id: "hazmat-basics",
    title: "Hazardous Materials - Basics",
    description: "Essential knowledge about hazmat identification, classification, and initial response procedures.",
    duration: "40 min",
    questions: 35
  },
  {
    id: "emt-assessment",
    title: "Emergency Medical - Patient Assessment",
    description: "Learn systematic patient assessment techniques and emergency medical protocols for first responders.",
    duration: "30 min",
    questions: 25
  }
];

export default function Quizzes() {
  const navigate = useNavigate();

  const handleQuizClick = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Firefighter Exam Prep
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Master your firefighting knowledge with our comprehensive quiz collection. 
            Practice with realistic scenarios and build confidence for your certification exams.
          </p>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card 
              key={quiz.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02] border-muted"
              onClick={() => handleQuizClick(quiz.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <BookOpen className="h-6 w-6 text-primary mb-2" />
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {quiz.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {quiz.questions} Q
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  {quiz.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <CardDescription className="text-sm leading-relaxed">
                  {quiz.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full group-hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuizClick(quiz.id);
                  }}
                >
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            More quizzes coming soon! Track your progress and identify areas for improvement.
          </p>
        </div>
      </div>
    </div>
  );
}