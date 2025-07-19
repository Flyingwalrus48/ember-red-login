import { useState } from "react";
import { Home, MapPin, Brain, Users } from "lucide-react";
import HomePage from "./dashboard/HomePage";
import PathPage from "./dashboard/PathPage";
import FireAIPage from "./dashboard/FireAIPage";
import ServicedinPage from "./dashboard/ServicedinPage";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home", icon: Home, component: HomePage },
    { id: "path", label: "PATH", icon: MapPin, component: PathPage },
    { id: "fireai", label: "FIREAI", icon: Brain, component: FireAIPage },
    { id: "servicedin", label: "Servicedin", icon: Users, component: ServicedinPage },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || HomePage;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 pb-20">
        <ActiveComponent />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 transition-all duration-200 ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""} transition-transform`} />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div className="w-6 h-0.5 bg-primary rounded-full animate-scale-in" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;