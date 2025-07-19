import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, MapPin, Target } from "lucide-react";

const PathPage = () => {
  const pathSteps = [
    {
      id: 1,
      title: "Physical Fitness Test",
      description: "Complete the CPAT (Candidate Physical Ability Test)",
      status: "completed",
      progress: 100,
      requirements: ["Stair climb", "Hose drag", "Equipment carry", "Ladder raise"]
    },
    {
      id: 2,
      title: "EMT Certification",
      description: "Obtain Emergency Medical Technician certification",
      status: "in-progress",
      progress: 75,
      requirements: ["Complete EMT course", "Pass state exam", "Background check"]
    },
    {
      id: 3,
      title: "Fire Academy",
      description: "Complete 16-week fire academy training program",
      status: "locked",
      progress: 0,
      requirements: ["Basic firefighting", "Hazmat training", "Rescue operations", "Fire prevention"]
    },
    {
      id: 4,
      title: "Department Application",
      description: "Apply to your target fire department",
      status: "locked",
      progress: 0,
      requirements: ["Written exam", "Oral interview", "Medical exam", "Psychological evaluation"]
    },
    {
      id: 5,
      title: "Probationary Period",
      description: "Complete 12-month probationary firefighter period",
      status: "locked",
      progress: 0,
      requirements: ["On-the-job training", "Performance evaluations", "Mentorship program"]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "in-progress":
        return <Target className="h-6 w-6 text-primary" />;
      default:
        return <Circle className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-primary";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Firefighter PATH</h1>
          <p className="text-muted-foreground">Your roadmap to becoming a firefighter</p>
        </div>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-6">
          {pathSteps.map((step, index) => (
            <div key={step.id} className="relative">
              <Card className={`ml-16 ${step.status === "locked" ? "opacity-60" : ""}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <Badge variant={
                          step.status === "completed" ? "default" : 
                          step.status === "in-progress" ? "secondary" : "outline"
                        }>
                          {step.status === "completed" ? "Complete" : 
                           step.status === "in-progress" ? "In Progress" : "Locked"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  
                  {step.status === "in-progress" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{step.progress}%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${step.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Requirements:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {step.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Step Icon */}
              <div className="absolute left-6 top-6 w-4 h-4 bg-background border-2 border-current rounded-full flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(step.status)}`} />
              </div>
              
              {/* Status Icon */}
              <div className="absolute left-0 top-4">
                {getStatusIcon(step.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PathPage;