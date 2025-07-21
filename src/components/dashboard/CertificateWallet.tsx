import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit, CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Certification {
  id: string;
  certification_name: string;
  status: string;
  expiration_date: string | null;
  completion_date: string | null;
  notes: string | null;
  created_at: string;
}

interface CertificationFormData {
  certification_name: string;
  status: string;
  completion_date: Date | undefined;
  expiration_date: Date | undefined;
  notes: string;
}

const statusOptions = [
  'Not Started',
  'Booked',
  'Completed',
  'Failed'
];

interface CertificateWalletProps {
  certifications: Certification[];
  onCertificationsChange: () => void;
}

const CertificateWallet: React.FC<CertificateWalletProps> = ({ 
  certifications, 
  onCertificationsChange 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [formData, setFormData] = useState<CertificationFormData>({
    certification_name: '',
    status: 'Not Started',
    completion_date: undefined,
    expiration_date: undefined,
    notes: ''
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in progress':
        return 'secondary';
      case 'expired':
        return 'destructive';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleEdit = (certificationId: string) => {
    const certification = certifications.find(cert => cert.id === certificationId);
    if (certification) {
      setEditingCertification(certification);
      setFormData({
        certification_name: certification.certification_name,
        status: certification.status,
        completion_date: certification.completion_date ? new Date(certification.completion_date) : undefined,
        expiration_date: certification.expiration_date ? new Date(certification.expiration_date) : undefined,
        notes: certification.notes || ''
      });
      setIsModalOpen(true);
    }
  };

  const handleAddNew = () => {
    setEditingCertification(null);
    setFormData({
      certification_name: '',
      status: 'Not Started',
      completion_date: undefined,
      expiration_date: undefined,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const certificationData = {
        user_id: user.id,
        certification_name: formData.certification_name,
        status: formData.status,
        completion_date: formData.completion_date ? formData.completion_date.toISOString().split('T')[0] : null,
        expiration_date: formData.expiration_date ? formData.expiration_date.toISOString().split('T')[0] : null,
        notes: formData.notes || null
      };

      let error;
      if (editingCertification) {
        // Update existing certification
        const { error: updateError } = await supabase
          .from('ofai_certifications')
          .update(certificationData)
          .eq('id', editingCertification.id);
        error = updateError;
      } else {
        // Create new certification
        const { error: insertError } = await supabase
          .from('ofai_certifications')
          .insert([certificationData]);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Certification ${editingCertification ? 'updated' : 'created'} successfully.`,
      });

      setIsModalOpen(false);
      onCertificationsChange(); // Refresh the list
    } catch (error) {
      console.error('Error saving certification:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingCertification ? 'update' : 'create'} certification. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = () => {
    return formData.certification_name.trim().length > 0;
  };

  const renderModal = () => (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingCertification ? 'Edit Certification' : 'Add New Certification'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="certification_name">Certification Name</Label>
            <Input
              id="certification_name"
              value={formData.certification_name}
              onChange={(e) => setFormData(prev => ({ ...prev, certification_name: e.target.value }))}
              placeholder="Enter certification name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Completion Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !formData.completion_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.completion_date ? format(formData.completion_date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.completion_date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, completion_date: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Expiration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !formData.expiration_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expiration_date ? format(formData.expiration_date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.expiration_date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, expiration_date: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid() || saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (certifications.length === 0) {
    return (
      <>
        <div className="text-center p-8">
          <div className="text-muted-foreground mb-4">No certifications found</div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Certification
          </Button>
        </div>
        {renderModal()}
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map((cert) => (
          <Card key={cert.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold leading-tight">
                  {cert.certification_name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(cert.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={getStatusColor(cert.status)}>
                  {cert.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expires:</span>
                <span className="text-sm font-medium">
                  {formatDate(cert.expiration_date)}
                </span>
              </div>

              {cert.completion_date && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed:</span>
                  <span className="text-sm font-medium">
                    {formatDate(cert.completion_date)}
                  </span>
                </div>
              )}

              {cert.notes && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">{cert.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {renderModal()}
    </>
  );
};

export default CertificateWallet;