import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users } from "lucide-react";

const HomePage = () => {
  const recruitmentAds = [
    {
      id: 1,
      department: "Los Angeles Fire Department",
      position: "Firefighter/Paramedic",
      location: "Los Angeles, CA",
      deadline: "2024-02-15",
      applicants: 127,
      status: "Active"
    },
    {
      id: 2,
      department: "Chicago Fire Department",
      position: "Firefighter",
      location: "Chicago, IL",
      deadline: "2024-02-28",
      applicants: 89,
      status: "Active"
    },
    {
      id: 3,
      department: "Miami-Dade Fire Rescue",
      position: "Fire Inspector",
      location: "Miami, FL",
      deadline: "2024-03-10",
      applicants: 45,
      status: "New"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Recent Recruitment</h1>
          <p className="text-muted-foreground">Latest firefighter job openings</p>
        </div>
      </div>

      <div className="grid gap-4">
        {recruitmentAds.map((ad) => (
          <Card key={ad.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{ad.position}</CardTitle>
                  <p className="text-sm font-medium text-primary">{ad.department}</p>
                </div>
                <Badge variant={ad.status === "New" ? "default" : "secondary"}>
                  {ad.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{ad.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Deadline: {ad.deadline}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{ad.applicants} applicants</span>
                </div>
              </div>
              <div className="pt-2">
                <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                  View Details
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;