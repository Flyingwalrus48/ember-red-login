import React from 'react';
import { CheckCircle, CircleDot, Lock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Certification {
  id: string;
  certification_name: string;
  status: string;
  ofai_stage?: string | null;
  expiration_date: string | null;
  completion_date: string | null;
  notes: string | null;
  created_at: string;
}

interface PathStepperProps {
  certifications: Certification[];
}

type StageStatus = 'Complete' | 'In Progress' | 'Locked';

interface TimelineItem {
  title: string;
  status: StageStatus;
  description: string;
  icon: React.ReactElement;
  badgeVariant: 'default' | 'secondary' | 'outline';
}

const PathStepper: React.FC<PathStepperProps> = ({ certifications }) => {
  // Function to determine stage status based on certifications
  const getStageStatus = (stageName: string): StageStatus => {
    const stageCertifications = certifications.filter(cert => cert.ofai_stage === stageName);
    
    if (stageCertifications.length === 0) {
      return 'Locked';
    }

    // Check if all certifications for this stage are completed
    const allCompleted = stageCertifications.every(cert => cert.status === 'Completed');
    if (allCompleted) {
      return 'Complete';
    }

    // Check if any certification is in progress or booked
    const anyInProgress = stageCertifications.some(cert => 
      cert.status === 'In Progress' || cert.status === 'Booked'
    );
    if (anyInProgress) {
      return 'In Progress';
    }

    return 'Locked';
  };

  // Function to get stage description based on certifications
  const getStageDescription = (stageName: string): string => {
    const stageCertifications = certifications.filter(cert => cert.ofai_stage === stageName);
    const completedCount = stageCertifications.filter(cert => cert.status === 'Completed').length;
    const totalCount = stageCertifications.length;
    
    if (totalCount === 0) {
      return 'No certifications available for this stage.';
    }

    return `${completedCount} of ${totalCount} certifications completed.`;
  };

  // Function to get icon and badge variant based on status
  const getStatusIcon = (status: StageStatus): React.ReactElement => {
    switch (status) {
      case 'Complete':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'In Progress':
        return <CircleDot className="h-6 w-6 text-blue-500" />;
      default:
        return <Lock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getBadgeVariant = (status: StageStatus): 'default' | 'secondary' | 'outline' => {
    switch (status) {
      case 'Complete':
        return 'default';
      case 'In Progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in progress':
      case 'booked':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Create dynamic timeline data based on OFAI stages
  const timelineData: TimelineItem[] = [
    {
      title: 'Stage One',
      status: getStageStatus('Stage One'),
      description: getStageDescription('Stage One'),
      icon: getStatusIcon(getStageStatus('Stage One')),
      badgeVariant: getBadgeVariant(getStageStatus('Stage One')),
    },
    {
      title: 'Stage Two',
      status: getStageStatus('Stage Two'),
      description: getStageDescription('Stage Two'),
      icon: getStatusIcon(getStageStatus('Stage Two')),
      badgeVariant: getBadgeVariant(getStageStatus('Stage Two')),
    },
    {
      title: 'Stage Three',
      status: getStageStatus('Stage Three'),
      description: getStageDescription('Stage Three'),
      icon: getStatusIcon(getStageStatus('Stage Three')),
      badgeVariant: getBadgeVariant(getStageStatus('Stage Three')),
    },
  ];
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative">
        {/* The vertical connecting line */}
        <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-border -z-10" />
        
        <div className="space-y-8">
          {timelineData.map((item, index) => {
            const stageCertifications = certifications.filter(cert => cert.ofai_stage === item.title);
            
            return (
              <div key={index} className="relative">
                {/* Icon and Title Row */}
                <div className="flex items-center gap-6 mb-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 bg-background rounded-full p-1 relative z-10">
                    {item.icon}
                  </div>
                  
                  {/* Title and Badge */}
                  <div className="flex-1 flex items-center justify-between">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <Badge variant={item.badgeVariant}>
                      {item.status}
                    </Badge>
                  </div>
                </div>

                {/* Certifications Card */}
                <div className="ml-16">
                  <Card className={`${item.status === 'Locked' ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      {stageCertifications.length === 0 ? (
                        <p className="text-muted-foreground italic">No certifications assigned to this stage</p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground mb-3">
                            Required Certifications ({stageCertifications.filter(cert => cert.status === 'Completed').length} of {stageCertifications.length} completed)
                          </p>
                          {stageCertifications.map((cert) => (
                            <div key={cert.id} className="flex items-center justify-between py-2">
                              <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  cert.status === 'Completed' ? 'bg-green-500' :
                                  cert.status === 'In Progress' || cert.status === 'Booked' ? 'bg-blue-500' :
                                  cert.status === 'Failed' ? 'bg-red-500' :
                                  'bg-muted-foreground'
                                }`} />
                                <span className="text-sm font-medium">
                                  {cert.certification_name}
                                </span>
                              </div>
                              <Badge 
                                variant={getStatusColor(cert.status)}
                                className="text-xs"
                              >
                                {cert.status}
                              </Badge>
                            </div>
                          ))}
                          
                          {/* Progress Bar */}
                          <div className="mt-4 pt-3 border-t">
                            <div className="w-full bg-muted h-2 rounded-full">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  item.status === 'Complete' ? 'bg-green-500' :
                                  item.status === 'In Progress' ? 'bg-blue-500' : 
                                  'bg-muted-foreground'
                                }`}
                                style={{ 
                                  width: `${stageCertifications.length > 0 ? 
                                    (stageCertifications.filter(cert => cert.status === 'Completed').length / stageCertifications.length) * 100 : 0
                                  }%` 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PathStepper;