// src/components/Dashboard.tsx

import { useState, useEffect } from "react"; // Keep for `isLoggingOut`
import { useSearchParams } from "react-router-dom"; // Keep if used elsewhere, or remove if only for tabs
import { LogOut, Shield, Flame } from "lucide-react"; // Keep only icons relevant to Dashboard's header
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client"; // Keep if used for logout
import HomePage from "./dashboard/HomePage";
import PathPage from "./dashboard/PathPage";
import FireAIPage from "./dashboard/FireAIPage";
import ServicedinPage from "./dashboard/ServicedinPage";
import { useNavigate } from "react-router-dom"; // Keep if used for logout redirection

const Dashboard = () => {
  // REMOVED: searchParams, activeTab, setActiveTab as they are now in GlobalLayout
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Only keep if Logout button remains in Dashboard header
  const navigate = useNavigate(); // Only keep if Logout button remains in Dashboard header

  // REMOVED: useEffect for tabParam as activeTab is now managed by GlobalLayout
  // The logic below is from your original Dashboard, if `tabParam` was only for the bottom nav, you can remove this useEffect too.
  // If Dashboard.tsx still needs to switch its *internal* components based on a tabParam, you might keep a simplified version.
  // For now, I'm assuming HomePage is always rendered, or the Dashboard page is simpler.
  // const [activeTab, setActiveTab] = useState("home"); // You'll define active component using this
  // useEffect(() => {
  //   const tabParam = searchParams.get('tab');
  //   if (tabParam && ['home', 'path', 'fireai', 'servicedin', 'quizzes'].includes(tabParam)) {
  //     setActiveTab(tabParam);
  //   }
  // }, [searchParams]);

  const handleLogout = async () => { // Keep if logout button remains in Dashboard header
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      navigate('/'); // Redirect after logout
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoggingOut(false);
    }
  };

  // REMOVED: tabs array as it's now in GlobalLayout
  // const tabs = [
  //   { id: "home", label: "Home", icon: Home, component: HomePage },
  //   { id: "path", label: "PATH", icon: MapPin, component: PathPage },
  //   { id: "fireai", label: "FIREAI", icon: Brain, component: FireAIPage },
  //   { id: "servicedin", label: "Servicedin", icon: Users, component: ServicedinPage },
  //   { id: "quizzes", label: "Quizzes", icon: BookOpen, action: () => navigate('/quizzes') },
  // ];

  // If you had multiple components rendered based on activeTab, you'll need to decide how Dashboard renders its content now.
  // For simplicity, let's assume Dashboard renders HomePage directly as its main content.
  // If Dashboard page is static or only renders one content, you can remove the ActiveComponent logic.
  // const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || HomePage;

  return (
    // REMOVED: min-h-screen, now handles content for GlobalLayout's <main>
    // The main Dashboard content itself. It will grow to fill space.
    <div className="flex flex-col flex-1 bg-background">
      {/* Header - Assuming this remains part of Dashboard. If global, move to GlobalLayout */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary" />
              <Flame className="h-4 w-4 text-primary absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">FireForce Training</h1>
              <p className="text-sm text-muted-foreground">Dashboard</p>
            </div>
          </div>
          <Button
            onClick={handleLogout} // Keep if logout button remains in header
            variant="outline"
            size="sm"
            disabled={isLoggingOut}
            className="flex items-center gap-2"
          >
            {isLoggingOut ? (
              <>
                <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                Signing Out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Log Out
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content Area for Dashboard - Content will fill the space */}
      {/* We apply flex-1 here so this content area pushes the fixed header up (if header was within Dashboard) */}
      <div className="flex-1 pb-20 overflow-y-auto"> {/* pb-20 to ensure content isn't hidden by dashboard's own footer if any, or just remove */}
        {/* Render your Dashboard content here. If Dashboard was switching components, adapt here. */}
        {/* For now, assuming HomePage as the main dashboard content */}
        <HomePage />
      </div>

      {/* REMOVED: Bottom Navigation - It's now in GlobalLayout.tsx */}
      {/*
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.action) {
                    tab.action();
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
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
      */}
    </div>
  );
};

export default Dashboard;