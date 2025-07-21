import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CertificateWallet from "./CertificateWallet";
import PathStepper from "./PathStepper";

interface Certification {
  id: string;
  certification_name: string;
  status: string;
  ofai_stage: string | null;
  expiration_date: string | null;
  completion_date: string | null;
  notes: string | null;
  created_at: string;
}

const PathPage = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { data, error } = await supabase
        .from('ofai_certifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCertifications(data || []);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      toast({
        title: "Error",
        description: "Failed to load certifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh certifications (to be passed to CertificateWallet)
  const refreshCertifications = () => {
    fetchCertifications();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2>The Main Journey</h2>
        <PathStepper certifications={certifications} />
      </div>

      <div>
        <h2>My "Ready-for-Hire" Wallet</h2>
        <CertificateWallet 
          certifications={certifications}
          onCertificationsChange={refreshCertifications}
        />
      </div>
    </div>
  );
};

export default PathPage;