import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import LoginPage from "@/components/LoginPage";
import Dashboard from "@/components/Dashboard";
import LoadingTransition from "@/components/LoadingTransition";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    // Check initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setShowTransition(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setShowTransition(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleTransitionComplete = async () => {
    setShowTransition(false);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showTransition) {
    return <LoadingTransition onComplete={handleTransitionComplete} />;
  }

  return user ? <Dashboard /> : <LoginPage />;
};

export default Index;
