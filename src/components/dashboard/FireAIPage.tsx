import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, CheckCircle, AlertCircle, Upload, FileText } from "lucide-react";

const FireAIPage = () => {
  const [resumeText, setResumeText] = useState("");
  const [coverLetterText, setCoverLetterText] = useState("");
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockAnalysis = {
    overallScore: 78,
    status: "passed", // passed, failed, needs-improvement
    sections: {
      resume: {
        score: 82,
        strengths: ["Strong emergency response experience", "Relevant certifications", "Community involvement"],
        improvements: ["Add more quantifiable achievements", "Include leadership examples"]
      },
      coverLetter: {
        score: 75,
        strengths: ["Clear motivation", "Professional tone"],
        improvements: ["Better department research", "More specific examples"]
      },
      questionnaire: {
        score: 77,
        areas: [
          { name: "Physical Readiness", score: 85 },
          { name: "Mental Preparedness", score: 72 },
          { name: "Technical Knowledge", score: 80 },
          { name: "Communication Skills", score: 70 }
        ]
      }
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysisResults(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-500 text-white">✓ Passed</Badge>;
      case "failed":
        return <Badge variant="destructive">✗ Failed</Badge>;
      default:
        return <Badge variant="secondary">Needs Improvement</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">FIREAI Analyzer</h1>
          <p className="text-muted-foreground">AI-powered assessment of your firefighter readiness</p>
        </div>
      </div>

      {!analysisResults && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Resume Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-32"
              />
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume File
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Cover Letter Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your cover letter content here..."
                value={coverLetterText}
                onChange={(e) => setCoverLetterText(e.target.value)}
                className="min-h-32"
              />
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Cover Letter File
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {!analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle>Firefighter Readiness Questionnaire</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Complete our comprehensive questionnaire to assess your overall readiness for a firefighting career.
            </p>
            <Button variant="outline" className="w-full">
              Start Questionnaire
            </Button>
          </CardContent>
        </Card>
      )}

      {!analysisResults && (
        <div className="flex justify-center">
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!resumeText && !coverLetterText)}
            className="px-8 py-3 text-lg"
          >
            {isAnalyzing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Analyze with FIREAI</span>
              </div>
            )}
          </Button>
        </div>
      )}

      {analysisResults && (
        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Overall Assessment</CardTitle>
                {getStatusBadge(analysisResults.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Readiness Score</span>
                    <span className={`font-bold ${getScoreColor(analysisResults.overallScore)}`}>
                      {analysisResults.overallScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-muted h-3 rounded-full">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        analysisResults.overallScore >= 80 ? "bg-green-500" :
                        analysisResults.overallScore >= 70 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${analysisResults.overallScore}%` }}
                    />
                  </div>
                </div>
                {analysisResults.status === "passed" ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resume Analysis</CardTitle>
                <div className={`text-2xl font-bold ${getScoreColor(analysisResults.sections.resume.score)}`}>
                  {analysisResults.sections.resume.score}/100
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {analysisResults.sections.resume.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-sm flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-600 mb-2">Areas for Improvement</h4>
                  <ul className="space-y-1">
                    {analysisResults.sections.resume.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="text-sm flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Questionnaire Results</CardTitle>
                <div className={`text-2xl font-bold ${getScoreColor(analysisResults.sections.questionnaire.score)}`}>
                  {analysisResults.sections.questionnaire.score}/100
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResults.sections.questionnaire.areas.map((area: any, index: number) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{area.name}</span>
                        <span className={`font-medium ${getScoreColor(area.score)}`}>
                          {area.score}/100
                        </span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            area.score >= 80 ? "bg-green-500" :
                            area.score >= 70 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${area.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => setAnalysisResults(null)}>
              New Analysis
            </Button>
            <Button>
              Download Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FireAIPage;